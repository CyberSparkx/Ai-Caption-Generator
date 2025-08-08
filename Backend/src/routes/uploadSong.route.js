const express= require('express');
const router=express.Router();
const Playlist = require('../models/playlist.model')
const multer = require('multer');
const ImageKit = require('imagekit');


var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

const upload = multer({ storage: multer.memoryStorage() });

router.post('/uploadSong', upload.single('song'), async (req, res) => {
    try {
        const {songName} = req.body;
        const song = req.file.buffer;
        if(!song){
            return res.status(400).json({message:'Song is required'})
        }
        if(!songName){
            return res.status(400).json({message:'Song Name is required'})
        }
        const response = await imagekit.upload({
            file:song,
            fileName:songName
        })

        if(!response.url){
            return res.status(400).json({
                message:'Failed to upload song'
            })
        }

        const SongUrl = response.url;
        const newSong = new Playlist({
            songName,
            SongUrl,
        })

        await newSong.save();
        res.status(201).json({
            message:'Song Uploaded Successfully'
        })

    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }
})


 module.exports = router;