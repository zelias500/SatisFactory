var mongoose = require('mongoose');
var User = require("./user");
var Product = require("./product");
var Schema = mongoose.Schema;
var _ = require('lodash')

var lineItemSchema = new Schema({
  price: Number,
  product: { type: Schema.Types.ObjectId, ref: 'Product'},
  quantity: Number
})

var orderSchema = new mongoose.Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true}, 
  items: [lineItemSchema],

  status: {type: String, enum: ['pending', 'shipping', 'completed', 'cancelled'], required: true, default: 'pending'},
  shipTo: { type: Address },
  billWith: { type: Billing }
  orderDate: {type: Date, default: new Date }

})

orderSchema.methods.addToOrder = function(cost, id, amount) {

  var checking = _.find(this.item, i => (i.product.equals(id) && i.price === cost));
  if (checking) {
    checking.quantity += amount
  }
  else {
    this.items.push({price: cost, product: id, quantity: amount})
  }
  this.save()
}



mongoose.model("Order", orderSchema);