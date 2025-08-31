import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication and admin requirement to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDesc: z.string().optional(),
  priceInPaise: z.number().int().positive('Price must be a positive integer'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.number().int().positive('Category ID is required'),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  isFeatured: z.boolean().default(false),
  images: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
  })).optional(),
});

const updateProductSchema = createProductSchema.partial();

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']).optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  deliveryDate: z.string().datetime().optional(),
});

// Helper function to generate product slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// GET /api/admin/products - Get all products for admin
router.get('/products', async (req: AuthRequest, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDesc: product.shortDesc,
      price: product.priceInPaise / 100,
      priceInPaise: product.priceInPaise,
      stock: product.stock,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      weight: product.weight,
      dimensions: product.dimensions,
      material: product.material,
      careInstructions: product.careInstructions,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
      images: product.images.map(img => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
      orderCount: product._count.orderItems,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    res.json({
      success: true,
      data: transformedProducts,
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
});

// POST /api/admin/products - Create new product
router.post('/products', async (req: AuthRequest, res) => {
  try {
    const productData = createProductSchema.parse(req.body);
    
    // Generate unique slug
    let slug = generateSlug(productData.name);
    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create product with images
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug,
        description: productData.description,
        shortDesc: productData.shortDesc,
        priceInPaise: productData.priceInPaise,
        stock: productData.stock,
        categoryId: productData.categoryId,
        weight: productData.weight,
        dimensions: productData.dimensions,
        material: productData.material,
        careInstructions: productData.careInstructions,
        isFeatured: productData.isFeatured,
        images: productData.images ? {
          create: productData.images,
        } : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.priceInPaise / 100,
        stock: product.stock,
        category: product.category.name,
        imageCount: product.images.length,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
    });
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', async (req: AuthRequest, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updateData = updateProductSchema.parse(req.body);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update slug if name changed
    let slug = existingProduct.slug;
    if (updateData.name && updateData.name !== existingProduct.name) {
      slug = generateSlug(updateData.name);
      const slugExists = await prisma.product.findFirst({
        where: { slug, id: { not: productId } },
      });
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...updateData,
        slug,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        slug: updatedProduct.slug,
        price: updatedProduct.priceInPaise / 100,
        stock: updatedProduct.stock,
        category: updatedProduct.category.name,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
    });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', async (req: AuthRequest, res) => {
  try {
    const productId = parseInt(req.params.id);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { orderItems: true },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if product has orders
    if (existingProduct.orderItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with existing orders. Consider deactivating instead.',
      });
    }

    // Delete product (cascade will handle images)
    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
});

// GET /api/admin/orders - Get all orders for admin
router.get('/orders', async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      totalAmount: order.totalInPaise / 100,
      itemCount: order.items.length,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderDate: order.orderDate,
      deliveryDate: order.deliveryDate,
      items: order.items.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.priceInPaise / 100,
      })),
    }));

    res.json({
      success: true,
      data: transformedOrders,
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
});

// PUT /api/admin/orders/:id - Update order status
router.put('/orders/:id', async (req: AuthRequest, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const updateData = updateOrderSchema.parse(req.body);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
    });
  }
});

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      monthlyRevenue,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.aggregate({
        _sum: { totalInPaise: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.order.aggregate({
        _sum: { totalInPaise: true },
        where: {
          status: { not: 'CANCELLED' },
          orderDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          active: activeProducts,
          inactive: totalProducts - activeProducts,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: totalOrders - pendingOrders,
        },
        revenue: {
          total: (totalRevenue._sum.totalInPaise || 0) / 100,
          monthly: (monthlyRevenue._sum.totalInPaise || 0) / 100,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
});

export default router;
