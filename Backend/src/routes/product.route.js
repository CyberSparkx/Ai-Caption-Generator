const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const ImageKit = require("imagekit");
const multer = require('multer');
require('dotenv').config(); 


const upload = multer({ storage: multer.memoryStorage() });

// Set up ImageKit with env variables
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// POST /addproduct
router.post('/addproduct', upload.single('productimage'), async (req, res) => {
    try {
        const { productname, productDetails, productPrice } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        // Upload image to ImageKit
        const uploadedImage = await imagekit.upload({
            file: req.file.buffer,
            fileName: `product_${Date.now()}`,
        });

        // Save product to DB
        const newProduct = new Product({
            productname,
            productDetails,
            productPrice,
            productimage: uploadedImage.url
        });

        await newProduct.save();

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct
        });

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;
