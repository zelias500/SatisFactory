var mongoose = require('mongoose');

var Product = require("./product");

var schema = new mongoose.Schema({
  user: { type: String, required: true },

})

mongoose.model("Order", schema);