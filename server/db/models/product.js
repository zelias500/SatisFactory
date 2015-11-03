var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true},
  description: { type: String, required: true },
  price: {type: Number, required: true},
  quantity: {type: Number, required: true},
  category: {type: [String], required: true},
  photo: {type: String}
})

productSchema.pre('save', function(next) {
	if (!this.photo) {
		this.photo = 'http://fillmurray.com/200/300'
	}
	next();
})
mongoose.model("Product", productSchema);