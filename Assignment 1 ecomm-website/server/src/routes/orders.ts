import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema
const orderQuerySchema = z.object({
  orderNumber: z.string(),
});

// GET /api/orders/:orderNumber - Get order details by order number
router.get('/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = orderQuerySchema.parse(req.params);

    const order = await prisma.order.findUnique({
      where: { orderNumber },
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

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Transform order for response (limited details for privacy)
    const transformedOrder = {
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.priceInPaise / 100,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.images[0]?.url,
        },
      })),
      pricing: {
        subtotal: order.subtotalInPaise / 100,
        shipping: order.shippingInPaise / 100,
        total: order.totalInPaise / 100,
      },
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderDate: order.orderDate,
      estimatedDeliveryDate: order.deliveryDate,
    };

    res.json({
      success: true,
      data: transformedOrder,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
    });
  }
});

export default router;
