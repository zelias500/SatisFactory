'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Review = mongoose.model('Review');

router.get('/', function(req, res, next){
	User.find({}).exec().then(function(users){
		res.status(200).json(users);
	}).then(null,next);
})

router.post('/', function(req, res, next){
	User.create({email: req.body.email}).then(function(user){
		res.status(201).json(user);
	}).then(null, next);
})

router.get('/email/:email', function(req, res, next){
	User.findOne({email: req.params.email}).exec().then(function(user){
		res.status(200).json(user);
	}).then(null, next);
})


router.get('/:id', function(req,res,next){
	console.log("reqparams", req.params.id, "is type", typeof req.params.id)
	User.findById(req.params.id).exec().then(function(user){
		if (!user) next();
		else {
			res.status(200).json(user);
		}
	})
	// .then(null, next); <--- WHY DOESNT THIS WORK??
	.then(null, function(err){
		// console.error(err);
		res.status(404).end();
	});
})

router.put("/:id", function(req, res, next){
	User.findById(req.params.id).exec().then(function(user){
		_.extend(user, req.body);
		return user.save();
	}).then(function(user){
		res.status(200).json(user);
	})
	// .then(null, next);
	.then(null, function(err){
		// console.error(err);
		res.status(404).end();
	});
})

router.delete('/:id', function(req, res, next){
	User.remove({_id: req.params.id}).exec().then(function(){
		res.status(204).end();
	})
	// .then(null, next);
	.then(null, function(err){
		// console.error(err);
		res.status(404).end();
	});
})

router.get('/:id/orders', function(req, res, next){
	Order.find({user: req.params.id}).exec().then(function(orders){
		res.status(200).json(orders);
	}).then(null, next)

})

router.get('/:id/reviews', function(req, res, next){
	Review.find({user: req.params.id}).exec().then(function(reviews){
		res.status(200).json(reviews);
	}).then(null, next)
})