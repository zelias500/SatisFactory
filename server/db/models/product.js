var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  title: { type: String, required: true, unique: true},
  description: { type: String, required: true },
  price: {type: Number, required: true}, // GTPT: in cents? validate?
  quantity: {type: Number, required: true, default: 0, min: 0}, // GTPT:  is this quantity in stock?, default?
  category: {type: Schema.Types.ObjectId, required: true, ref: 'Category'},
  photo: {type: String}
})

// GTPT: how about a method that gets the average numStars of all reviews of that product
// GTPT: or a method that gets all reviews for that product

productSchema.pre('save', function(next) {
	if (!this.photo) {
		this.photo = 'http://fillmurray.com/200/300'
	}
	next();
})
mongoose.model("Product", productSchema);
