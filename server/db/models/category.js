var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var categorySchema = new mongoose.Schema({
	name: {type: String, required: true},
	products: [{type: Schema.Types.ObjectId, ref: 'Product'}]
})

mongoose.model("Category", categorySchema);