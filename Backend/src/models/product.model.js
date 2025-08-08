const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true
  },
  productDetails: {
    type: String, 
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productimage: {
    type: String,
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Product', productSchema);
