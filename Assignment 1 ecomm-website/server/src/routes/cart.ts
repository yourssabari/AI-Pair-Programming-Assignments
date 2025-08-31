import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const checkoutSchema = z.object({
  customerInfo: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  }),
  shippingAddress: z.object({
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().optional(),
    pincode: z.string().min(5, 'Pincode must be at least 5 characters'),
  }),
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive().max(10),
  })).min(1, 'At least one item is required'),
  paymentMethod: z.enum(['COD', 'MOCK_UPI', 'MOCK_CARD']),
});

// Helper function to generate order number
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `CC-${year}${month}${day}-${timestamp}`;
}

// POST /api/cart/checkout - Process guest checkout
router.post('/checkout', async (req, res) => {
  try {
    const checkoutData = checkoutSchema.parse(req.body);

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Validate products and check stock
      const productIds = checkoutData.items.map(item => item.productId);
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      });

      if (products.length !== productIds.length) {
        throw new Error('One or more products not found or inactive');
      }

      // Check stock and calculate totals
      let subtotalInPaise = 0;
      const orderItems = [];

      for (const item of checkoutData.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        const itemTotal = product.priceInPaise * item.quantity;
        subtotalInPaise += itemTotal;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          priceInPaise: product.priceInPaise, // Store price at time of order
        });

        // Update product stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Calculate shipping (simple flat rate for now)
      const shippingInPaise = subtotalInPaise >= 200000 ? 0 : 10000; // Free shipping over ₹2000
      const totalInPaise = subtotalInPaise + shippingInPaise;

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerName: checkoutData.customerInfo.name,
          customerEmail: checkoutData.customerInfo.email,
          customerPhone: checkoutData.customerInfo.phone,
          shippingAddress: checkoutData.shippingAddress.address,
          shippingCity: checkoutData.shippingAddress.city,
          shippingState: checkoutData.shippingAddress.state,
          shippingPincode: checkoutData.shippingAddress.pincode,
          subtotalInPaise,
          shippingInPaise,
          totalInPaise,
          paymentMethod: checkoutData.paymentMethod,
          paymentStatus: checkoutData.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          status: 'PENDING',
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: orderItems.map(item => ({
          ...item,
          orderId: order.id,
        })),
      });

      return order;
    });

    // Fetch complete order with items for response
    const completeOrder = await prisma.order.findUnique({
      where: { id: result.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  where: { isPrimary: true },
                  select: { url: true, altText: true },
                },
              },
            },
          },
        },
      },
    });

    if (!completeOrder) {
      throw new Error('Failed to retrieve created order');
    }

    // Transform order for response
    const transformedOrder = {
      id: completeOrder.id,
      orderNumber: completeOrder.orderNumber,
      status: completeOrder.status,
      customerInfo: {
        name: completeOrder.customerName,
        email: completeOrder.customerEmail,
        phone: completeOrder.customerPhone,
      },
      shippingAddress: {
        address: completeOrder.shippingAddress,
        city: completeOrder.shippingCity,
        state: completeOrder.shippingState,
        pincode: completeOrder.shippingPincode,
      },
      items: completeOrder.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.priceInPaise / 100,
        priceInPaise: item.priceInPaise,
        total: (item.priceInPaise * item.quantity) / 100,
        totalInPaise: item.priceInPaise * item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.images[0]?.url,
        },
      })),
      pricing: {
        subtotal: completeOrder.subtotalInPaise / 100,
        subtotalInPaise: completeOrder.subtotalInPaise,
        shipping: completeOrder.shippingInPaise / 100,
        shippingInPaise: completeOrder.shippingInPaise,
        total: completeOrder.totalInPaise / 100,
        totalInPaise: completeOrder.totalInPaise,
      },
      paymentMethod: completeOrder.paymentMethod,
      paymentStatus: completeOrder.paymentStatus,
      orderDate: completeOrder.orderDate,
    };

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: transformedOrder,
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Checkout failed',
    });
  }
});

// POST /api/cart/validate - Validate cart items before checkout
router.post('/validate', async (req, res) => {
  try {
    const validateSchema = z.object({
      items: z.array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })),
    });

    const { items } = validateSchema.parse(req.body);

    if (items.length === 0) {
      return res.json({
        success: true,
        data: {
          items: [],
          valid: true,
          issues: [],
        },
      });
    }

    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        priceInPaise: true,
        stock: true,
        isActive: true,
      },
    });

    const validatedItems = [];
    const issues = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      
      if (!product) {
        issues.push({
          productId: item.productId,
          issue: 'Product not found or inactive',
        });
        continue;
      }

      const itemValidation = {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        requestedQuantity: item.quantity,
        availableStock: product.stock,
        price: product.priceInPaise / 100,
        priceInPaise: product.priceInPaise,
        isAvailable: product.stock >= item.quantity,
        maxQuantity: Math.min(product.stock, 10), // Limit to 10 per item
      };

      if (product.stock < item.quantity) {
        issues.push({
          productId: item.productId,
          issue: `Insufficient stock. Available: ${product.stock}, Requested: ${item.quantity}`,
          availableStock: product.stock,
        });
      }

      validatedItems.push(itemValidation);
    }

    const isValid = issues.length === 0;

    res.json({
      success: true,
      data: {
        items: validatedItems,
        valid: isValid,
        issues,
        summary: {
          totalItems: validatedItems.length,
          totalIssues: issues.length,
          totalValue: validatedItems.reduce((sum, item) => {
            return sum + (item.isAvailable ? item.priceInPaise * item.requestedQuantity : 0);
          }, 0) / 100,
        },
      },
    });
  } catch (error) {
    console.error('Error validating cart:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Cart validation failed',
    });
  }
});

export default router;
