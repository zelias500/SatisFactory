var mongoose =  require('mongoose');
var Product = require('./product');
var Schema = mongoose.Schema;
var User = require('./user')

var schema = new Schema({
  // GTPT: should these be required fields? or are there anon. reviews
  product: {type: Schema.Types.ObjectId , ref: 'Product'},
  user:{type: Schema.Types.ObjectId , ref: 'User'},
  content: {type:String, required:true , validate:{
    validator: function(content){
      return content.length > 10
    },
    message: 'Content is invalid'
  }},// GTPT: will this be validated on the front end too?
  numStars: Number
  // GTPT: min and max on stars

})

mongoose.model('Review', schema);
