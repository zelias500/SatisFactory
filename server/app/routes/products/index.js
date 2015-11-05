var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Product = mongoose.model('Product')
var Category = mongoose.model('Category');
var _ = require('lodash');

router.get('/', function(req, res, next) {
  Product.find({})
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
    Category.find({}).exec().then(function(categories){
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
  .then(function(product){
    req.product = product;
    next();
  })
  .then(null, next);
})

router.get("/:id", function(req, res, next){
  res.status(200).json(req.product)
})

router.get('/:id/reviews', function(req, res, next){
    if(req.product.reviews.length === 0){
      res.status(200).json("There are no Reviews")
    }
    else{
    req.product.populate('reviews')
    .then(function(product){
        res.status(200).json(product);
    }).then(null, next)}
})


router.put("/:id", function(req, res, next){
  delete req.body._id
  _.extend(req.product, req.body);
  req.product.save().then(function(product){
    res.status(201).json(product);
  }).then(null, next);
})

router.delete("/:id", function(req, res, next){
  req.product.remove()
  .then(function(){
    res.sendStatus(204);
  })
})


module.exports = router;
