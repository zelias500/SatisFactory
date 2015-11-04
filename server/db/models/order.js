var mongoose = require('mongoose');
var User = require("./user");
var Product = require("./product");
var Schema = mongoose.Schema;
var _ = require('lodash')

var lineItemSchema = new Schema({
  price: {type:Number, required:true}
  product: { type: Schema.Types.ObjectId, ref: 'Product', required:true},
  quantity: {type:Number, required:true}
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

lineItemSchema.methods.isInStock = function(){
  var self = this
    this.populate('product')
    .execPopulate()
    .then(function(item){
        return item.product.quantity > self.quantity      
    })

}




mongoose.model("Order", orderSchema);
