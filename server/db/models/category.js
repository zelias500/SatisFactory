var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var categorySchema = new mongoose.Schema({
	name: {type: String, required: true}
})

mongoose.model("Category", categorySchema);