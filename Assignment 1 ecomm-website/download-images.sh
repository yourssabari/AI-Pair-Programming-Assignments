#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p /Users/vasurekha/sabari/AI\ Pair\ \ Programming/Assignments/ecomm-website3/client/public/images

# Download sample clay product images from Unsplash (free license)
cd "/Users/vasurekha/sabari/AI Pair  Programming/Assignments/ecomm-website3/client/public/images"

echo "Downloading sample clay product images..."

# Hero image - pottery making
curl -L "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80" -o "hero-pottery.jpg"

# Mugs and cups
curl -L "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80" -o "mug-1.jpg"
curl -L "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" -o "mug-2.jpg"
curl -L "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" -o "mug-3.jpg"

# Bowls and tableware
curl -L "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80" -o "bowl-1.jpg"
curl -L "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" -o "bowl-2.jpg"
curl -L "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80" -o "bowl-3.jpg"

# Vases and decorative items
curl -L "https://images.unsplash.com/photo-1578662015879-30a0ca113176?w=400&q=80" -o "vase-1.jpg"
curl -L "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" -o "vase-2.jpg"
curl -L "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80" -o "vase-3.jpg"

# Planters
curl -L "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" -o "planter-1.jpg"
curl -L "https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&q=80" -o "planter-2.jpg"
curl -L "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" -o "planter-3.jpg"

echo "✅ Sample images downloaded successfully!"
echo "Images saved to: $(pwd)"
