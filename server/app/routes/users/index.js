'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Review = mongoose.model('Review');
var _ = require('lodash');

var authorizeAccess = function(requestUser, targetUser){
	return ((requestUser._id === targetUser._id) || (requestUser.isAdmin))
}

router.get('/', function(req, res, next){
	User.find({}).then(function(users){ 
		res.status(200).json(users);
	}).then(null,next);
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
	if (authorizeAccess(req.user, req.targetUser)){
		delete req.body._id;
		_.extend(req.targetUser, req.body);
		req.targetUser.save().then(function(user){
			res.status(200).json(user);
		}).then(null, next)		
	}
	else {
		res.status(403).end();
	}
})

router.delete('/:id', function(req, res, next){
	if (authorizeAccess(req.user, req.targetUser)){
		req.targetUser.remove().then(function(){
			res.status(204).end();
		}).then(null, next);		
	}
	else {
		res.status(403).end();
	}
})

router.get('/:id/billing', function(req, res, next){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('billing').exec().then(function(user){
			res.status(200).json(user.billing);	
		})
	}
	else {
		res.status(403).end()
	}
})

router.post('/:id/billing', function(req, res, next){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('billing').exec().then(function(user){
			user.billing.push(req.body);
			return user.save();
		}).then(function(user){
			res.status(201).json(req.targetUser.billing);
		})
	}
	else {
		res.status(403).end()
	}
})

router.put('/:id/billing', function(req, res, next){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('billing').exec().then(function(user){
			var bill = _.findIndex(user.billing, function(i){
				return i = req.body;
			})
			user.billing.splice(bill, 1);
				
			return user.save()
		})
		.then(function(user){
			res.status(200).json(user)
		})		
	}
	else {
		res.status(403).end();
	}
})

router.get('/:id/shipping', function(req, res, next){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('shipping').exec().then(function(user){
			res.status(200).json(user.shipping);	
		});
	}
	else {
		res.status(403).end();
	}
})

router.post('/:id/shipping', function(req, res, next){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('shipping').exec().then(function(user){
			user.shipping.push(req.body);
			return user.save()
		}).then(function(user){
			res.status(201).json(user.shipping);
		})
	}
	else {
		res.status(403).end();
	}
})

router.put('/:id/shipping', function(req, res, next){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('shipping').exec().then(function(user){
			var address = _.findIndex(user.shipping, function(i){
				return i = req.body;
			})
			user.shipping.splice(address, 1);
			return user.save()		
		}).then(function(user){
			res.status(200).json(user)
		})
	}
	else {
		res.status(403).end();
	}
})

router.get('/:id/orders', function(req, res, next){
	if (authorizeAccess(req.user, req.targetUser)){
		Order.find({user: req.params.id}).exec().then(function(orders){
			res.status(200).json(orders);
		}).then(null, next)
	}
	else {
		res.status(403).end();
	}
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
    if (authorizeAccess(req.user, req.targetUser)){
	    req.body.wishlistedBy = req.targetUser._id
	    req.targetUser.wishlist.push(req.body)
	    req.targetUser.save()
	        .then(function(user) {
	            res.status(201).json(user.wishlist)
	        })    	
    }
    else {
    	res.status(403).end();
    }
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
	if (authorizeAccess(req.user, req.targetUser)){
	    delete req.targetUser.wishlist
	    req.targetUser.save()
	        .then(function(user) {
	            res.status(204).end()
	        })		
	}
	else {
		res.status(403).end();
	}
})