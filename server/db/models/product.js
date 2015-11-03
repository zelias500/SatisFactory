var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  title: { type: String, required: true }
})

mongoose.model("Product", schema);