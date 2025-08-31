import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// POST /api/upload/image - Upload and optimize image
router.post('/image', authenticateToken, requireAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.jpg`;
    const filepath = path.join(uploadDir, filename);

    // Process and optimize image with Sharp
    await sharp(req.file.buffer)
      .resize(800, 800, { // Max 800x800, maintain aspect ratio
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 85,
        progressive: true,
      })
      .toFile(filepath);

    // Generate URL
    const imageUrl = `/uploads/${filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename,
        originalName: req.file.originalname,
        size: fs.statSync(filepath).size,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/upload/multiple - Upload multiple images
router.post('/multiple', authenticateToken, requireAdmin, upload.array('images', 5), async (req: AuthRequest, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided',
      });
    }

    const uploadedImages = [];

    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.jpg`;
      const filepath = path.join(uploadDir, filename);

      // Process and optimize image
      await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          progressive: true,
        })
        .toFile(filepath);

      uploadedImages.push({
        url: `/uploads/${filename}`,
        filename,
        originalName: file.originalname,
        size: fs.statSync(filepath).size,
      });
    }

    res.json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      data: {
        images: uploadedImages,
        count: uploadedImages.length,
      },
    });
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// DELETE /api/upload/:filename - Delete uploaded image
router.delete('/:filename', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(uploadDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Delete file
    fs.unlinkSync(filepath);

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
