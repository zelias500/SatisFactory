'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Review = mongoose.model('Review');
var Wishlist = mongoose.model('Wishlist');

var authorizeAccess = function(requestUser, targetUser){
	return requestUser._id.equals(targetUser._id) || requestUser.isAdmin
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

router.get('/:id', function(req,res){
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

router.get('/:id/billing', function(req, res){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('billing').exec().then(function(user){
    	delete user.billing.cvc;
    	user.billing = user.billing.map(function(option){
    	 option.number = "XXXX-XXXX-XXXX-" + option.number.slice(-4);
    	 return option;
    	});
			res.status(200).json(user.billing);
		})
	}
	else {
		res.status(403).end()
	}
})

router.post('/:id/billing', function(req, res){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('billing').exec().then(function(user){
			user.billing.push(req.body);
			return user.save();
		}).then(function(user){
			res.status(201).json(user.billing);
		})
	}
	else {
		res.status(403).end()
	}
})

router.put('/:id/billing', function(req, res){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('billing').exec().then(function(user){
			var bill = _.findIndex(user.billing, function(i){
				return i === req.body;
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

router.get('/:id/shipping', function(req, res){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('shipping').exec().then(function(user){
			res.status(200).json(user.shipping);
		});
	}
	else {
		res.status(403).end();
	}
})

router.post('/:id/shipping', function(req, res){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).then(function(user){

			 console.log("the user is", user)
			 user.shipping.push(req.body)
			 console.log('add shipping', user)
			return user.save()
		}).then(function(user){
			res.status(201).json(user.shipping);
		})
	}
	else {
		res.status(403).end();
	}
})

router.put('/:id/shipping', function(req, res){
	if (authorizeAccess(req.user, req.targetUser)){
		User.findById(req.targetUser._id).select('shipping').exec().then(function(user){
			var address = _.findIndex(user.shipping, function(i){
				return i === req.body;
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

router.get('/:id/wishlist', function(req, res) {
    // res.status(200).json(req.targetUser.wishlist)
    req.targetUser.populate('wishlist').execPopulate().then(function(user){
    	res.status(200).json(req.targetUser);
    })
})

router.get('/:id/wishlist/:wishlistId', function(req, res) {
	Wishlist.findById(req.params.wishlistId).deepPopulate('items.product')
	.then(function(wishlist){
		res.status(200).json(wishlist)
	})
})

router.post('/:id/wishlist', function(req, res, next) {
    if (authorizeAccess(req.user, req.targetUser)) {
    	var aWishlist = new Wishlist({
	    	items: req.body.items,
	    	wlName: req.body.wlName,
	    	wishlistedBy: req.targetUser._id})
    	aWishlist.save()
	    	.then(function(theWishlist) {
	    		req.user.wishlist.push(theWishlist._id)
	    		req.user.save()
	    	.then(function(user) {
	    		res.status(201).json(user)
	    	})
	    	.then(null, next)})}
    else {
    	res.status(403).end();
    }
})

router.post('/:id/wishlist/:wishlistId', function(req, res, next){
	Wishlist.findById(req.params.wishlistId).then(function(wishlist){
		wishlist.items.push(req.body);
		return wishlist.save();
	}).then(function(wishlist){
		res.status(200).json(wishlist);
	}).then(null, next)
})

router.put('/:id/wishlist/:wishlistId', function(req, res) {
    var x = _.findIndex(req.targetUser.wishlist, function(i) {
        return i === req.body
    })
    req.targetUser.wishlist.splice(x, 1)
    req.targetUser.save()
        .then(function(user) {
            res.status(200).json(user.wishlist)
        })
})

router.delete('/:id/wishlist', function(req, res) {
	if (authorizeAccess(req.user, req.targetUser)){delete req.targetUser.wishlist;
		req.targetUser.save().then(function(user) {
	        	res.status(204).end()})
	}
	else {
		res.status(403).end();
	}
})