const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
const Gadget = require('../models/Gadget');
const auth = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get all gadgets
router.get('/', async (req, res) => {
  try {
    const gadgets = await Gadget.find({ status: 'available' })
      .populate('seller', 'username phoneNumber upiId')
      .sort({ createdAt: -1 });
    res.json(gadgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gadgets', error: error.message });
  }
});

// Get user's gadgets
router.get('/my-gadgets', auth, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const gadgets = await Gadget.find({ sellerEmail: email })
      .sort({ createdAt: -1 });
    res.json(gadgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your gadgets', error: error.message });
  }
});

// Get single gadget
router.get('/:id', async (req, res) => {
  try {
    const gadget = await Gadget.findById(req.params.id)
      .populate('seller', 'username phoneNumber upiId');
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gadget', error: error.message });
  }
});

// Create new gadget
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Compress and process image
    const compressedImage = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Convert image to base64
    const base64Image = compressedImage.toString('base64');

    const gadget = new Gadget({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      image: `data:image/jpeg;base64,${base64Image}`,
      seller: req.user.userId,
      sellerEmail: req.body.sellerEmail,
      phoneNumber: req.body.phoneNumber,
      upiId: req.body.upiId
    });

    await gadget.save();
    res.status(201).json(gadget);
  } catch (error) {
    console.error('Error creating gadget:', error);
    res.status(500).json({ message: 'Error creating gadget', error: error.message });
  }
});

// Delete gadget
router.delete('/:id', auth, async (req, res) => {
  try {
    const gadget = await Gadget.findById(req.params.id);
    
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found' });
    }

    if (gadget.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this gadget' });
    }

    await gadget.remove();
    res.json({ message: 'Gadget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gadget', error: error.message });
  }
});

module.exports = router; 