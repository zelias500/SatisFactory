var mongoose =  require('mongoose');
var Product = require('./product');
var Schema = mongoose.Schema;
var User = require('./user')

var schema = new Schema({
  product: {type: Schema.Types.ObjectId , ref: 'Product', required: true},
  user:{type: Schema.Types.ObjectId , ref: 'User'},
  content: {type:String, required:true , validate:{
    validator: function(content){
      return content.length > 10
    },
    message: 'Content is invalid'
  }},
  numStars: {type: Number, min: 1, max: 5, default: 1}

})

mongoose.model('Review', schema);
