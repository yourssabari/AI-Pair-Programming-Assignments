# ClayCraft - Artisan Clay Products E-commerce

A minimal but complete e-commerce web application for selling handcrafted clay products, built with modern web technologies and optimized for development in VS Code Dev Containers.

## 🎯 Project Overview

ClayCraft is a full-stack e-commerce platform featuring:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript  
- **Database**: SQLite with Prisma ORM
- **Development**: Docker Dev Container for VS Code
- **Testing**: Jest + React Testing Library (Frontend) and Jest + Supertest (Backend)

## 🚀 Quick Start with Dev Container

### Prerequisites
- **Docker Desktop v24.0.6+** (Required)
- **VS Code** with Dev Container extension
- No need for Node.js on host machine - everything runs in container

### 1-Click Setup
1. Clone this repository
2. Open in VS Code
3. When prompted, click **"Reopen in Container"** (or press `Ctrl+Shift+P` → "Reopen in Container")
4. Wait for container to build (first time only)
5. Container will automatically:
   - Install all dependencies
   - Set up the database
   - Run migrations and seed data

### Start Development Servers
Inside the Dev Container terminal:

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
npm run dev:client    # Frontend on http://localhost:5173
npm run dev:server    # Backend on http://localhost:4000
```

## 🛒 Features

### Customer Features
- **Product Catalog**: Browse clay products by category (Mugs, Planters, Decor, Tableware)
- **Product Details**: High-quality images, descriptions, pricing in INR
- **Shopping Cart**: localStorage-based cart with real-time updates
- **Guest Checkout**: Simple order form with customer details
- **Order Confirmation**: Order tracking with unique order numbers
- **Responsive Design**: Mobile-first, accessible interface

### Admin Features
- **Admin Dashboard**: Secure login with JWT authentication
- **Product Management**: Full CRUD operations for products
- **Image Upload**: Local image storage to `/public/uploads`
- **Order Management**: View and manage customer orders

### Technical Features
- **Filters**: Category, price range, stock availability
- **Search**: Product search functionality
- **SEO Ready**: Meta tags, structured data
- **Accessibility**: WCAG 2.1 AA compliance
- **Internationalization**: i18n ready with en-IN locale

## 🗄️ Database Schema

### Core Models
- **Product**: name, description, price, category, images, stock
- **Category**: organized product classification
- **Order**: customer orders with line items
- **User**: admin authentication
- **ProductImage**: multiple images per product

All prices stored as integers in paisa (₹1 = 100 paisa) for precision.

## 🔌 API Endpoints

### Public Endpoints
```
GET    /api/products              # List all products with filters
GET    /api/products/:slug        # Get product details
POST   /api/cart/checkout         # Process guest checkout
GET    /api/orders/:orderNumber   # Get order details (limited)
```

### Admin Endpoints (JWT Required)
```
POST   /api/auth/login           # Admin authentication
POST   /api/auth/logout          # Logout
GET    /api/admin/products       # Get all products for admin
POST   /api/admin/products       # Create new product
PUT    /api/admin/products/:id   # Update product
DELETE /api/admin/products/:id   # Delete product
POST   /api/admin/upload         # Upload product images
```

## 🌱 Seeded Data

The application comes with sample data:
- **12 Clay Products**: Mugs, planters, decorative items, tableware
- **4 Categories**: Mugs, Planters, Decor, Tableware
- **Admin User**: 
  - Email: `admin@claycraft.com`
  - Password: `admin123`

## 📁 Project Structure

```
├── .devcontainer/           # VS Code Dev Container configuration
│   ├── devcontainer.json   # Container setup and extensions
│   └── Dockerfile          # Development container image
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js + Express backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Backend utilities
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   ├── migrations/    # Database migrations
│   │   └── seed.ts        # Database seeding script
│   └── package.json       # Backend dependencies
├── public/uploads/        # Uploaded product images
├── docker-compose.yml     # Multi-service container setup
└── package.json          # Root workspace scripts
```

## 🛠️ Development Scripts

### Root Level Commands
```bash
npm run dev              # Start both client and server
npm run dev:client       # Start frontend only (port 5173)
npm run dev:server       # Start backend only (port 4000)
npm run build            # Build both client and server
npm run test             # Run all tests
npm run lint             # Lint all code
npm run format           # Format code with Prettier
```

### Database Commands
```bash
npm run db:migrate       # Run Prisma migrations
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database (migrate + seed)
npm run db:studio        # Open Prisma Studio (database GUI)
```

## 🎨 Design System

### Color Palette
- **Primary**: Warm terracotta (#D2691E)
- **Secondary**: Sage green (#9CAF88)
- **Accent**: Cream (#F5F5DC)
- **Neutral**: Warm browns and grays

### Typography
- **Headings**: Inter (clean, modern)
- **Body**: Inter (readable, web-safe)

### Icons
- Feather Icons for consistent, lightweight iconography
- Custom product category icons

## 🧪 Testing

### Frontend Tests
```bash
cd client
npm test                 # Run React component tests
npm run test:coverage    # Generate coverage report
```

### Backend Tests
```bash
cd server
npm test                 # Run API endpoint tests
npm run test:integration # Run integration tests
```

## 🔧 Environment Configuration

### Environment Variables
Create `.env` files in both `client/` and `server/` directories:

**server/.env**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=4000
UPLOAD_DIR="./public/uploads"
```

**client/.env**
```env
VITE_API_BASE_URL="http://localhost:4000/api"
```

## 📸 Image Management

### Product Images
- Stored locally in `/public/uploads/`
- Automatic image optimization
- Multiple images per product supported
- Alt text for accessibility

### Sample Images
Free stock images included for demo products from:
- Unsplash (pottery, ceramics)
- Pexels (handmade crafts)
- Pixabay (clay art)

## 🔒 Security Features

- **JWT Authentication**: Secure admin access
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Protection**: React built-in protection
- **CORS Configuration**: Controlled cross-origin requests

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Large tap targets, swipe gestures
- **Performance**: Lazy loading, optimized images

## 🚀 Production Deployment

### Build for Production
```bash
npm run build            # Build both frontend and backend
```

### Database
- SQLite file persists in `/server/prisma/dev.db`
- For production, consider PostgreSQL or MySQL
- Database migrations handle schema changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes in the Dev Container
4. Run tests: `npm test`
5. Submit a pull request

## 📞 Support

### Admin Access
- **URL**: `http://localhost:5173/admin`
- **Email**: `admin@claycraft.com`
- **Password**: `admin123`

### Troubleshooting

**Container Issues:**
- Rebuild container: `Ctrl+Shift+P` → "Rebuild Container"
- Check Docker Desktop is running
- Ensure sufficient disk space (2GB+)

**Database Issues:**
- Reset database: `npm run db:reset`
- Check SQLite file permissions
- Verify Prisma migrations are up to date

**Port Conflicts:**
- Frontend (5173) and Backend (4000) ports forwarded automatically
- Change ports in docker-compose.yml if needed

## 📝 License

MIT License - see LICENSE file for details.

## 🏷️ Version

Current Version: 1.0.0

Built with ❤️ for artisan clay crafters worldwide.
