var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Product = mongoose.model('Product')
var Category = mongoose.model('Category');
var Review = mongoose.model('Review');
var User = mongoose.model('User');
var _ = require('lodash');

router.get('/', function(req, res, next) {
  Product.find({})
    .populate('category')
    .then(function(products) {
      res.status(200).json(products)
    })
    .then(null, next);
})

router.post('/', function(req, res, next) {
  Product.create(req.body)
    .then(function(product) {
      res.status(201).json(product)
    })
    .then(null, next)
})

router.get('/category', function(req, res, next) {
  if (!Object.keys(req.query).length) {
    Category.find({})
    .populate('products', 'photo')
    .exec()
    .then(function(categories){
      res.status(201).json(categories)
    }).then(null, next)
  }

  else {
    Category.find(req.query).populate('products').exec().then(function(products){
      res.status(201).json(products)
    }).then(null, next)

  }
})

router.param("id", function(req, res, next, id){
  Product.findById(id)
  .populate('reviews')
  .populate('category')
  .deepPopulate('reviews.user')
  .exec()
  .then(function(product){
    product.reviews = product.reviews.map(function(review){
      if(!review.user.name){
        return review.user.name === "Anonymous";
      }
    })
    req.product = product;
    next();
  })
  .then(null, next);
})

router.get("/:id", function(req, res){
  res.status(200).json(req.product)
})

router.get('/:id/reviews', function(req, res){
    if(req.product.reviews.length === 0){
      res.status(200).json("There are no Reviews")
    } else {
      res.status(200).json(req.product.reviews);
    }
})


router.put("/:id", function(req, res, next){
  delete req.body._id
  _.extend(req.product, req.body);
  req.product.save().then(function(product){
    res.status(201).json(product);
  }).then(null, next);
})

router.delete("/:id", function(req, res){
  req.product.remove()
  .then(function(){
    res.sendStatus(204);
  })
})


module.exports = router;
