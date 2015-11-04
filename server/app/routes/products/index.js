var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Product = mongoose.model('Product')

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

// GTPT: query string
router.get('/category', function(req, res, next) {
  if (Object.keys(req.query).length === 0) {
  var allCats = [];
  Product.find({})
  .select('category -_id')
  .then(function(categories) {
    // GTPT: _.unique(categories)
    categories.forEach(function(element) {
      element.category.forEach(function(cat){
        if(allCats.indexOf(cat) === -1){
          allCats.push(cat);
        }
      })
    })
    res.status(200).json(allCats)
  })
  .then(null, next)
  }
  else {
    Product.find(req.query)
      .then(function(products) {
        res.status(200).json(products)
      })
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


router.put("/:id", function(req, res, next){
  // GTPT: router.param('id', blah)
  // GTPT: req.product.set(req.body)
  // GTPT: req.product.save()
  Product.findByIdAndUpdate(req.product._id, req.body)
  .then(function(product){
    return Product.findById(product._id)
  })
  .then(function(product){
      res.status(201).json(product);
  })
  .then(null, next);
})

router.delete("/:id", function(req, res, next){
  // GTPT: yay
  req.product.remove()
  .then(function(){
    res.sendStatus(200);
  })
})


module.exports = router;
