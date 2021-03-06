'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Review = mongoose.model('Review');
var Product = mongoose.model('Product');

router.get('/', function(req, res, next){
	Review.find({}).then(function(reviews){
       res.status(200).json(reviews)
	}).then(null, next)
})

router.get('/:id', function(req, res, next){
	Review.findById(req.params.id).exec().then(function(review){
       res.status(200).json(review)
	}).then(null, next)

})

router.post('/', function(req, res, next){
	var theReview;
	Review.create(req.body).then(function(review){
		theReview = review;
		return User.findById(review.user)
	}).then(function(user){
		if(user){
			user.reviews.push(theReview._id);
			return user.save()
		}
	})
	.then(function(){
		return Product.findById(theReview.product)
	})
	.then(function(product){
		product.reviews.push(theReview);
		return product.save();
	})
	.then(function(product){
		return Product.findById(product._id)
		.populate('reviews')
		.deepPopulate('reviews.user')
		.exec()
		.then(function(product){
			product.reviews = product.reviews.map(function(review){
				if(!review.user.name){
					return review.user.name == "Anonymous";
				};
      });
			return product;
    });
	})
	.then(function(product){
		res.status(201).json(product);	
	})
	.then(null, next);
})


router.put('/:id', function(req, res, next){
	Review.findById(req.params.id).exec().then(function(review){
		_.extend(review, req.body);
		review.save();
       res.status(200).json(review)
	}).then(null, next)

})

router.delete('/:id', function(req, res, next){
	Review.remove({_id : req.params.id}).exec().then(function(){
      res.status(200).end()
	}).then(null, next)
})