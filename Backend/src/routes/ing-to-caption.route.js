const express = require('express');
const router = express.Router();
const CaptionGeneratorModel = require('../models/captionGenerator.model')
const ImageKit = require("imagekit");
const multer = require('multer');
require('dotenv').config(); 
const generateCaption = require('../Services/ai-img-to-caption.service')

const upload = multer({ storage: multer.memoryStorage() });


// Set up ImageKit with env variables
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});



router.post('/caption-generator',upload.single('image'), async (req,res)=>{
    try {
        const image = req.file;
        const prompt = req.body.prompt;
        if(!image) return res.status(400).json({ message: 'Image is required' });

         // Upload image to ImageKit
         const uploadedImage = await imagekit.upload({
            file: image.buffer,
            fileName: `product_${Date.now()}`,
        });

        if(!uploadedImage.url) return res.status(400).json({ message: 'Not Uploaded' });

        const base64image = Buffer.from(image.buffer).toString('base64');
        const caption = await generateCaption(base64image,prompt)

        const post = new CaptionGeneratorModel({
            postImage:uploadedImage.url,
            postCaption:caption,
        })

        await post.save();
        res.status(201).json({message:"Caption Created Successfullt"})
    } catch (error) {
        console.log(error);
        
    }
} )

router.get('/get-posts', async (req, res) => {
    try {
        const data = await CaptionGeneratorModel.find(); 
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching posts." });
    }
});





module.exports =router;