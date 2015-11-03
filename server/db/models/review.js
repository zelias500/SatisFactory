var mongoose =  require('mongoose');
var Product = require('./product');
var Schema = mongoose.Schema;
var User = require('./user')

var schema = new Schema({
  product: {type: Schema.Types.ObjectId , ref: 'Product'},
  user:{type: Schema.Types.ObjectId , ref: 'User'},
  content: {type:String, required:true , validate:{
    validator: function(content){
      return content.length > 10
    },
    message: 'Content is invalid'
  }},
  numStars: Number

})

mongoose.model('Review', schema);