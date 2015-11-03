var mongoose = require('mongoose');

var Product = require("./product");
var Schema = mongoose.Schema;

var schema = new mongoose.Schema({
  user: {type: String, required: true},
  item: {type: [{
  	price: Number,
  	productId: { type: Schema.Types.ObjectId, ref:"Product"  },
  	quantity: Number 
  }],
	required: true
	}
})



mongoose.model("Order", schema);