var mongoose = require('mongoose');
var User = require("./user");
var Product = require("./product");
var Schema = mongoose.Schema;

var lineItemSchema = new mongoose.Schema({
    price: Number, // GTPT: validate, maybe store it in cents to avoid floating point math
    productId: { type: Schema.Types.ObjectId, ref:"Product"  },
    // GTPT: you should call this product
    quantity: Number
  })

var orderSchema = new mongoose.Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  // GTPT: try making a line item schema
  // item: [LineItemSchema]
  item: [lineItemSchema],
  status: {type: String, enum: ['pending', 'shipping', 'completed', 'cancelled'], required: true, default: 'pending'},
  shipTo: String,
  // GTPT: schema?
  billWith: String,
  // GTPT: schema?
  orderDate: {type: Date, default: new Date}
})

// GTPT: you should save
orderSchema.methods.addToOrder = function(cost, id, amount) {
  // GTPT: use lodash! yay!
  // _.find(this.item, i => (i.product.equals(id) && i.price === cost));
	var checking = this.item.filter(function(i) {
		if (i.productId === id && i.price === cost) {
			return true
		}
		return false
	})
	if (checking.length) {
		this.item[indexOf(checking[0])].quantity += amount
	}
	else {
		this.item.push({price: cost, productId: id, quantity: amount})
	}
}


mongoose.model("Order", orderSchema);
