const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    songName: String,
    SongUrl:String
})

module.exports = mongoose.model('Playlist', playlistSchema)