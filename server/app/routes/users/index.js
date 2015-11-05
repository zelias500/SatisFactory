'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Review = mongoose.model('Review');
var _ = require('lodash');


router.get('/', function(req, res, next){
	User.find({}).then(function(users){ 
		res.status(200).json(users);
	}).then(null,next);
})

router.get('/me', function(req, res, next){
	res.json(req.user);
})

router.post('/', function(req, res, next){
  User.create(req.body).then(function(user){
    res.status(201).json(user);
  }).then(null, next);
})

router.get('/email', function(req, res, next){
	User.findOne(req.query).then(function(user){
		res.status(200).json(user);
	}).then(null, next);
})

router.param("id", function(req, res, next, id){
	User.findById(id).then(function(user){
		req.targetUser = user;
		next();
	}).then(null, next)
})

router.get('/:id', function(req,res,next){
	res.status(200).json(req.targetUser)
})

router.put("/:id", function(req, res, next){
	delete req.body._id;
	_.extend(req.targetUser, req.body);
	req.targetUser.save().then(function(user){
		res.status(200).json(user);
	}).then(null, next)
})

router.delete('/:id', function(req, res, next){
	req.targetUser.remove().then(function(){
		res.status(204).end();
	}).then(null, next);
})

router.get('/:id/billing', function(req, res, next){
	res.status(200).json(req.targetUser.billing);
})

router.post('/:id/billing', function(req, res, next){
	req.targetUser.billing.push(req.body);
	req.targetUser.save().then(function(user){
		res.status(201).json(req.targetUser.billing);
	})
})

router.put('/:id/billing', function(req, res, next){
	var bill = _.findIndex(req.targetUser.billing, function(i){
		return i = req.body;
	})
	req.targetUser.billing.splice(bill, 1);
	req.targetUser.save().then(function(user){
		res.status(200).json(user)
	})
})

router.get('/:id/shipping', function(req, res, next){
	res.status(200).json(req.targetUser.shipping);
})

router.post('/:id/shipping', function(req, res, next){
	req.targetUser.shipping.push(req.body);
	req.targetUser.save().then(function(user){
		res.status(201).json(req.targetUser.shipping);
	})
})

router.put('/:id/shipping', function(req, res, next){
	var address = _.findIndex(req.targetUser.shipping, function(i){
		return i = req.body;
	})
	req.targetUser.shipping.splice(address, 1);
	req.targetUser.save().then(function(user){
		res.status(200).json(user)
	})
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

router.get('/:id/wishlist', function(req, res, next) {
    res.status(200).json(req.targetUser.wishlist)
})

router.post('/:id/wishlist', function(req, res, next) {
    req.body.wishlistedBy = req.targetUser._id
    req.targetUser.wishlist.push(req.body)
    req.targetUser.save()
        .then(function(user) {
            res.status(201).json(user.wishlist)
        })
})

router.put('/:id/wishlist', function(req, res, next) {
    var x  = _.findIndex(req.targetUser.wishlist, function(i) {
        return i === req.body
    })
    req.targetUser.wishlist.splice(x, 1)
    req.targetUser.save()
        .then(function(user) {
            res.status(200).json(user.wishlist)
        })
})

router.delete('/:id/wishlist', function(req, res, next) {
    delete req.targetUser.wishlist
    req.targetUser.save()
        .then(function(user) {
            res.status(204).end()
        })
})