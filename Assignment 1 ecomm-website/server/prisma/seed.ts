import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Categories
  console.log('📂 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Mugs & Cups',
        slug: 'mugs-cups',
        description: 'Handcrafted clay mugs and cups for your daily beverages',
  image: '/images/mug-1.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Planters',
        slug: 'planters',
        description: 'Beautiful clay planters for your indoor and outdoor plants',
  image: '/images/planter-1.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Decorative Items',
        slug: 'decorative-items',
        description: 'Artistic clay decorations to beautify your space',
  image: '/images/vase-1.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Tableware',
        slug: 'tableware',
        description: 'Elegant clay plates, bowls, and serving dishes',
  image: '/images/bowl-1.jpg',
      },
    }),
  ]);

  // Create Admin User
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.create({
    data: {
      email: 'admin@claycraft.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create Products with Images
  console.log('🏺 Creating products...');
  
  // Mugs & Cups
  const mugProducts = [
    {
      name: 'Rustic Coffee Mug',
      slug: 'rustic-coffee-mug',
      description: 'A beautifully handcrafted rustic coffee mug with a natural clay finish. Perfect for your morning coffee ritual.',
      shortDesc: 'Handcrafted rustic coffee mug with natural finish',
      priceInPaise: 89900, // ₹899
      stock: 25,
      isFeatured: true,
      weight: 0.3,
      dimensions: '10x8x9 cm',
      material: 'Natural terracotta clay',
      careInstructions: 'Hand wash with mild soap. Microwave safe.',
      categoryId: categories[0].id,
      images: [
        { url: '/images/mug-1.jpg', altText: 'Rustic coffee mug front view', isPrimary: true, sortOrder: 1 },
        { url: '/images/mug-2.jpg', altText: 'Rustic coffee mug side view', isPrimary: false, sortOrder: 2 },
      ],
    },
    {
      name: 'Glazed Tea Cup Set',
      slug: 'glazed-tea-cup-set',
      description: 'Elegant set of 4 glazed tea cups with saucers. Each cup is uniquely crafted with a beautiful blue-green glaze.',
      shortDesc: 'Set of 4 glazed tea cups with saucers',
      priceInPaise: 199900, // ₹1999
      stock: 15,
      isFeatured: true,
      weight: 1.2,
      dimensions: '8x8x6 cm each',
      material: 'Glazed stoneware clay',
      careInstructions: 'Dishwasher safe. Avoid sudden temperature changes.',
      categoryId: categories[0].id,
      images: [
        { url: '/images/mug-2.jpg', altText: 'Glazed tea cup set complete', isPrimary: true, sortOrder: 1 },
        { url: '/images/mug-3.jpg', altText: 'Individual tea cup detail', isPrimary: false, sortOrder: 2 },
      ],
    },
    {
      name: 'Artisan Espresso Cup',
      slug: 'artisan-espresso-cup',
      description: 'Small, perfectly sized espresso cup with a unique textured finish. Ideal for espresso lovers.',
      shortDesc: 'Textured artisan espresso cup',
      priceInPaise: 69900, // ₹699
      stock: 30,
      weight: 0.15,
      dimensions: '6x6x5 cm',
      material: 'Fine clay with textured glaze',
      careInstructions: 'Hand wash recommended. Heat resistant.',
      categoryId: categories[0].id,
      images: [
        { url: '/images/mug-3.jpg', altText: 'Artisan espresso cup', isPrimary: true, sortOrder: 1 },
      ],
    },
    {
      name: 'Matte Black Mug',
      slug: 'matte-black-mug',
      description: 'Sleek matte black ceramic mug with ergonomic handle. Modern look for everyday use.',
      shortDesc: 'Sleek matte black ceramic mug',
      priceInPaise: 99900, // ₹999
      stock: 22,
      isFeatured: false,
      weight: 0.32,
      dimensions: '9x9x10 cm',
      material: 'High-fired ceramic, matte glaze',
      careInstructions: 'Dishwasher safe. Avoid metal scrubbers.',
      categoryId: categories[0].id,
      images: [
        { url: '/images/mug-1.jpg', altText: 'Matte black ceramic mug', isPrimary: true, sortOrder: 1 },
      ],
    },
    {
      name: 'Speckled Stoneware Cup',
      slug: 'speckled-stoneware-cup',
      description: 'Hand-thrown stoneware cup with subtle speckled glaze and natural rim.',
      shortDesc: 'Hand-thrown speckled stoneware cup',
      priceInPaise: 74900, // ₹749
      stock: 28,
      weight: 0.25,
      dimensions: '8x8x8 cm',
      material: 'Stoneware with speckled glaze',
      careInstructions: 'Microwave safe. Hand wash recommended.',
      categoryId: categories[0].id,
      images: [
        { url: '/images/mug-2.jpg', altText: 'Speckled stoneware cup', isPrimary: true, sortOrder: 1 },
      ],
    },
  ];

  // Planters
  const planterProducts = [
    {
      name: 'Large Terracotta Planter',
      slug: 'large-terracotta-planter',
      description: 'Spacious terracotta planter perfect for medium to large plants. Features drainage holes and a classic design.',
      shortDesc: 'Large terracotta planter with drainage',
      priceInPaise: 149900, // ₹1499
      stock: 20,
      isFeatured: true,
      weight: 2.5,
      dimensions: '25x25x20 cm',
      material: 'Natural terracotta clay',
      careInstructions: 'Weather resistant. Clean with water and soft brush.',
      categoryId: categories[1].id,
      images: [
        { url: '/images/planter-1.jpg', altText: 'Large terracotta planter', isPrimary: true, sortOrder: 1 },
        { url: '/images/planter-2.jpg', altText: 'Planter with plant', isPrimary: false, sortOrder: 2 },
      ],
    },
    {
      name: 'Hanging Clay Planter',
      slug: 'hanging-clay-planter',
      description: 'Beautiful hanging planter with rope. Perfect for trailing plants and creating vertical gardens.',
      shortDesc: 'Hanging clay planter with rope',
      priceInPaise: 119900, // ₹1199
      stock: 18,
      weight: 1.0,
      dimensions: '15x15x12 cm',
      material: 'Glazed ceramic clay',
      careInstructions: 'Indoor/outdoor use. Check rope condition regularly.',
      categoryId: categories[1].id,
      images: [
        { url: '/images/planter-3.jpg', altText: 'Hanging clay planter', isPrimary: true, sortOrder: 1 },
      ],
    },
    {
      name: 'Mini Succulent Pots Set',
      slug: 'mini-succulent-pots-set',
      description: 'Adorable set of 6 mini pots perfect for succulents and small plants. Comes with a wooden tray.',
      shortDesc: 'Set of 6 mini succulent pots with tray',
      priceInPaise: 89900, // ₹899
      stock: 25,
      isFeatured: true,
      weight: 1.5,
      dimensions: '8x8x6 cm each',
      material: 'Glazed ceramic clay',
      careInstructions: 'Perfect for indoor use. Drainage holes included.',
      categoryId: categories[1].id,
      images: [
        { url: '/images/planter-2.jpg', altText: 'Mini succulent pots set', isPrimary: true, sortOrder: 1 },
        { url: '/images/planter-3.jpg', altText: 'Individual mini pot', isPrimary: false, sortOrder: 2 },
      ],
    },
    {
      name: 'Geometric Table Planter',
      slug: 'geometric-table-planter',
      description: 'Minimal geometric planter for succulents and cacti. Clean design for desks and shelves.',
      shortDesc: 'Minimal geometric planter',
      priceInPaise: 109900, // ₹1099
      stock: 26,
      isFeatured: false,
      weight: 0.9,
      dimensions: '14x14x12 cm',
      material: 'Matte ceramic',
      careInstructions: 'Indoor use. Wipe clean with damp cloth.',
      categoryId: categories[1].id,
      images: [
        { url: '/images/planter-1.jpg', altText: 'Geometric table planter', isPrimary: true, sortOrder: 1 },
      ],
    },
    {
      name: 'Self-Watering Clay Pot',
      slug: 'self-watering-clay-pot',
      description: 'Porous clay pot that naturally regulates moisture for healthier roots.',
      shortDesc: 'Porous self-watering clay pot',
      priceInPaise: 159900, // ₹1599
      stock: 17,
      weight: 1.6,
      dimensions: '20x20x18 cm',
      material: 'Terracotta clay',
      careInstructions: 'Use indoors or shade. Rinse to clean.',
      categoryId: categories[1].id,
      images: [
        { url: '/images/planter-2.jpg', altText: 'Self-watering clay pot', isPrimary: true, sortOrder: 1 },
      ],
    },
  ];

  // Decorative Items
  const decorProducts = [
    {
      name: 'Clay Elephant Figurine',
      slug: 'clay-elephant-figurine',
      description: 'Hand-painted clay elephant figurine with intricate details. A beautiful decorative piece for any home.',
      shortDesc: 'Hand-painted clay elephant figurine',
      priceInPaise: 169900, // ₹1699
      stock: 12,
      isFeatured: true,
      weight: 0.8,
      dimensions: '15x10x12 cm',
      material: 'Hand-painted terracotta clay',
      careInstructions: 'Dust with soft cloth. Avoid water contact.',
      categoryId: categories[2].id,
      images: [
        { url: '/images/vase-1.jpg', altText: 'Clay elephant figurine', isPrimary: true, sortOrder: 1 },
      ],
    },
    {
      name: 'Decorative Clay Vase',
      slug: 'decorative-clay-vase',
      description: 'Elegant tall vase with geometric patterns. Perfect for fresh or dried flowers.',
      shortDesc: 'Tall decorative vase with geometric patterns',
      priceInPaise: 139900, // ₹1399
      stock: 16,
      weight: 1.2,
      dimensions: '12x12x25 cm',
      material: 'Glazed stoneware with painted designs',
      careInstructions: 'Water resistant. Clean with damp cloth.',
      categoryId: categories[2].id,
      images: [
        { url: '/images/vase-2.jpg', altText: 'Decorative clay vase', isPrimary: true, sortOrder: 1 },
        { url: '/images/vase-3.jpg', altText: 'Vase with flowers', isPrimary: false, sortOrder: 2 },
      ],
    },
    {
      name: 'Traditional Diya Set',
      slug: 'traditional-diya-set',
      description: 'Set of 12 traditional clay diyas (oil lamps) perfect for festivals and special occasions.',
      shortDesc: 'Set of 12 traditional clay diyas',
      priceInPaise: 49900, // ₹499
      stock: 40,
      weight: 0.6,
      dimensions: '5x5x2 cm each',
      material: 'Traditional terracotta clay',
      careInstructions: 'Use with oil and cotton wicks. Handle with care.',
      categoryId: categories[2].id,
      images: [
        { url: '/images/vase-3.jpg', altText: 'Traditional diya set', isPrimary: true, sortOrder: 1 },
      ],
    },
    {
      name: 'Clay Wall Plate',
      slug: 'clay-wall-plate',
      description: 'Hand-painted wall plate with traditional motifs. Adds warmth and character to living spaces.',
      shortDesc: 'Hand-painted clay wall plate',
      priceInPaise: 129900, // ₹1299
      stock: 19,
      isFeatured: false,
      weight: 0.7,
      dimensions: '22x22x3 cm',
      material: 'Painted terracotta',
      careInstructions: 'Wipe gently. Avoid moisture.',
      categoryId: categories[2].id,
      images: [
        { url: '/images/vase-1.jpg', altText: 'Clay wall plate', isPrimary: true, sortOrder: 1 },
      ],
    },
    {
      name: 'Incense Holder Dish',
      slug: 'incense-holder-dish',
      description: 'Minimal incense holder with ash-catch dish. Calming addition to your meditation corner.',
      shortDesc: 'Minimal clay incense holder',
      priceInPaise: 59900, // ₹599
      stock: 35,
      weight: 0.3,
      dimensions: '12x12x2 cm',
      material: 'Unglazed clay with clear coat',
      careInstructions: 'Wipe ash after use.',
      categoryId: categories[2].id,
      images: [
        { url: '/images/vase-2.jpg', altText: 'Clay incense holder dish', isPrimary: true, sortOrder: 1 },
      ],
    },
  ];

  // Tableware
  const tablewareProducts = [
    {
      name: 'Ceramic Dinner Plate Set',
      slug: 'ceramic-dinner-plate-set',
      description: 'Set of 6 ceramic dinner plates with a beautiful matte finish. Perfect for everyday dining.',
      shortDesc: 'Set of 6 ceramic dinner plates',
      priceInPaise: 249900, // ₹2499
      stock: 10,
      isFeatured: true,
      weight: 3.0,
      dimensions: '26x26x2 cm each',
      material: 'High-fired ceramic clay',
      careInstructions: 'Dishwasher and microwave safe.',
      categoryId: categories[3].id,
      images: [
        { url: '/images/bowl-1.jpg', altText: 'Ceramic dinner plate set', isPrimary: true, sortOrder: 1 },
        { url: '/images/bowl-2.jpg', altText: 'Individual dinner plate', isPrimary: false, sortOrder: 2 },
      ],
    },
    {
      name: 'Clay Serving Bowl',
      slug: 'clay-serving-bowl',
      description: 'Large serving bowl perfect for salads, fruits, or serving dishes. Rustic and elegant design.',
      shortDesc: 'Large clay serving bowl',
      priceInPaise: 129900, // ₹1299
      stock: 14,
      weight: 1.8,
      dimensions: '30x30x8 cm',
      material: 'Natural clay with food-safe glaze',
      careInstructions: 'Hand wash recommended. Food safe.',
      categoryId: categories[3].id,
      images: [
        { url: '/images/bowl-3.jpg', altText: 'Clay serving bowl', isPrimary: true, sortOrder: 1 },
      ],
    },
    {
      name: 'Artisan Soup Bowls',
      slug: 'artisan-soup-bowls',
      description: 'Set of 4 handcrafted soup bowls with unique glazed patterns. Each bowl is one-of-a-kind.',
      shortDesc: 'Set of 4 handcrafted soup bowls',
      priceInPaise: 179900, // ₹1799
      stock: 12,
      weight: 2.0,
      dimensions: '18x18x6 cm each',
      material: 'Artisan glazed stoneware',
      careInstructions: 'Microwave and dishwasher safe.',
      categoryId: categories[3].id,
      images: [
        { url: '/images/bowl-2.jpg', altText: 'Artisan soup bowls set', isPrimary: true, sortOrder: 1 },
        { url: '/images/bowl-3.jpg', altText: 'Individual soup bowl', isPrimary: false, sortOrder: 2 },
      ],
    },
    {
      name: 'Oval Serving Platter',
      slug: 'oval-serving-platter',
      description: 'Generous oval platter with warm glaze. Ideal for family-style serving.',
      shortDesc: 'Generous oval serving platter',
      priceInPaise: 189900, // ₹1899
      stock: 11,
      isFeatured: false,
      weight: 2.2,
      dimensions: '38x26x3 cm',
      material: 'Stoneware, food-safe glaze',
      careInstructions: 'Dishwasher safe.',
      categoryId: categories[3].id,
      images: [
        { url: '/images/bowl-1.jpg', altText: 'Oval serving platter', isPrimary: true, sortOrder: 1 },
      ],
    },
    {
      name: 'Dessert Bowls Set',
      slug: 'dessert-bowls-set',
      description: 'Set of 6 small bowls perfect for desserts and sides. Smooth glossy interior with matte exterior.',
      shortDesc: 'Set of 6 dessert bowls',
      priceInPaise: 159900, // ₹1599
      stock: 16,
      weight: 1.6,
      dimensions: '12x12x5 cm each',
      material: 'Glazed ceramic',
      careInstructions: 'Microwave and dishwasher safe.',
      categoryId: categories[3].id,
      images: [
        { url: '/images/bowl-2.jpg', altText: 'Dessert bowls set', isPrimary: true, sortOrder: 1 },
      ],
    },
  ];

  // Create all products
  const allProducts = [...mugProducts, ...planterProducts, ...decorProducts, ...tablewareProducts];
  
  for (const productData of allProducts) {
    const { images, ...productInfo } = productData;
    const product = await prisma.product.create({
      data: productInfo,
    });

    // Create product images
    await prisma.productImage.createMany({
      data: images.map(img => ({
        ...img,
        productId: product.id,
      })),
    });
  }

  // Create a sample order
  console.log('📦 Creating sample order...');
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'CC-2024-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+91-9876543210',
      shippingAddress: '123 Main Street, Apartment 4B',
      shippingCity: 'Mumbai',
      shippingState: 'Maharashtra',
      shippingPincode: '400001',
      subtotalInPaise: 179800, // ₹1798
      shippingInPaise: 10000,   // ₹100
      totalInPaise: 189800,     // ₹1898
      paymentMethod: 'COD',
      status: 'CONFIRMED',
    },
  });

  // Add order items
  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.orderItem.create({
      data: {
        orderId: sampleOrder.id,
        productId: firstProduct.id,
        quantity: 2,
        priceInPaise: firstProduct.priceInPaise,
      },
    });
  }

  console.log('✅ Database seeding completed successfully!');
  
  console.log('\n📊 Seeding Summary:');
  console.log(`• ${categories.length} categories created`);
  console.log(`• ${allProducts.length} products created`);
  console.log('• 1 admin user created (admin@claycraft.com / admin123)');
  console.log('• 1 sample order created');
  console.log('\n🚀 Ready to start development!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
