const mongoose = require('mongoose');

const captionGeneratorSchema = new mongoose.Schema({
  postImage: String,
  postCaption: String,
  createdAt: {
    type: Date,
    default: Date.now, 
  }
});

module.exports = mongoose.model('CaptionGeneratorSchema', captionGeneratorSchema);
