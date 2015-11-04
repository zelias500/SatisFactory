var mongoose = require('mongoose');
var User = require("./user");
var Product = require("./product");
var Schema = mongoose.Schema;

var lineItemSchema = new Schema({
  price: Number,
  product: { type: Schema.Types.ObjectId, ref: 'Product'},
  quantity: Number
})

var orderSchema = new mongoose.Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true}, 
  items: [lineItemSchema],
  status: {type: String, enum: ['pending', 'shipping', 'completed', 'cancelled'], required: true, default: 'pending'},
  shipTo: String,
  billWith: String,
  orderDate: {type: Date, default: new Date }
})

orderSchema.methods.addToOrder = function(cost, id, amount) {
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