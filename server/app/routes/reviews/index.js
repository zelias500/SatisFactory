'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Review = mongoose.model('Review');


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
		user.reviews.push(theReview._id);
		return user.save()
	}).then(function(){
		res.status(201).json(review);
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