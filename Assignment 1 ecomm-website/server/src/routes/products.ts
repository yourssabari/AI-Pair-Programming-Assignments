import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  inStock: z.string().transform((val) => val === 'true').optional(),
  featured: z.string().transform((val) => val === 'true').optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12'),
  sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// GET /api/products - Get all products with filters
router.get('/', async (req, res) => {
  try {
    const query = productQuerySchema.parse(req.query);
    
    const where: any = {
      isActive: true,
    };

    // Apply filters
    if (query.category) {
      where.category = {
        slug: query.category,
      };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { shortDesc: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.minPrice || query.maxPrice) {
      where.priceInPaise = {};
      if (query.minPrice) where.priceInPaise.gte = query.minPrice * 100;
      if (query.maxPrice) where.priceInPaise.lte = query.maxPrice * 100;
    }

    if (query.inStock) {
      where.stock = { gt: 0 };
    }

    if (query.featured) {
      where.isFeatured = true;
    }

    // Calculate pagination
    const skip = (query.page - 1) * query.limit;

    // Get products with count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        skip,
        take: query.limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Transform products for response
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDesc: product.shortDesc,
      price: product.priceInPaise / 100, // Convert paise to rupees
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
      })),
      primaryImage: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    const totalPages = Math.ceil(total / query.limit);

    res.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          currentPage: query.page,
          totalPages,
          totalItems: total,
          itemsPerPage: query.limit,
          hasNextPage: query.page < totalPages,
          hasPrevPage: query.page > 1,
        },
        filters: {
          category: query.category,
          search: query.search,
          minPrice: query.minPrice,
          maxPrice: query.maxPrice,
          inStock: query.inStock,
          featured: query.featured,
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/products/:slug - Get single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get related products (same category, excluding current product)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      include: {
        images: {
          where: { isPrimary: true },
        },
      },
      take: 4,
    });

    const transformedProduct = {
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
        description: product.category.description,
      },
      images: product.images.map(img => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
      relatedProducts: relatedProducts.map(rp => ({
        id: rp.id,
        name: rp.name,
        slug: rp.slug,
        shortDesc: rp.shortDesc,
        price: rp.priceInPaise / 100,
        primaryImage: rp.images[0]?.url,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    res.json({
      success: true,
      data: transformedProduct,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/products/categories/list - Get all categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count.products,
    }));

    res.json({
      success: true,
      data: transformedCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
