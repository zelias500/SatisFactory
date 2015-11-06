var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Review = require('./review')
var deepPopulate = require('mongoose-deep-populate')(mongoose);



var productSchema = new Schema({
  title: { type: String, required: true, unique: true},
  description: { type: String, required: true },
  price: {type: Number, get: getPrice, set: setPrice},
  quantity: {type: Number, required: true, default: 0, min: 0}, 
  category: {type: Schema.Types.ObjectId, required: true, ref: 'Category'},
  photo: {type: String},
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
})

productSchema.plugin(deepPopulate, {}); 

function getPrice(num) {
  return (num/100).toFixed(2)
}

function setPrice(num) {
  return num * 100
}

productSchema.methods.averageStars = function() {

var aveStars = 0, sum = 0, numReviews=0;
  his.populate('reviews').execPopulate()
    .then(function(product) {    
       if(product.reviews.length == 0){
         aveStars = 1;
       }
       else{
        product.reviews.forEach(function(review) {
          numReviews++
          sum += review.numStars
        }) 
       aveStars = sum / numReviews
    }
       return aveStars;
    })

     
}

productSchema.methods.getAllReviews = function(){
    return this.populate('reviews').execPopulate()
      .then(function(product){
        return product.reviews;
    })
}

productSchema.pre('save', function(next) {
	if (!this.photo) {
		this.photo = 'http://fillmurray.com/200/300'
	}
	next();
})


mongoose.model("Product", productSchema);
