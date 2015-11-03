var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
})

mongoose.model("Product", productSchema);