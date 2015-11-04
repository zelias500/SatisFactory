var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Order = mongoose.model('Order');
var _ = require('lodash');

router.get("/", function(req, res, next){
  Order.find({})
  .then(function(orders){
    res.status(200).json(orders);
  })
  .then(null, next);
});

router.post("/", function(req, res, next){
  Order.create(req.body)
  .then(function(createdOrder){
    res.status(201).json(createdOrder);
  })
  .then(null, next);
})

router.param("id", function(req, res, next, id){
  Order.findById(id)
  .then(function(order){
    req.order = order;
    next();
  })
  .then(null, next);
})

router.get("/:id", function(req, res, next){
  res.status(200).json(req.order);
})

router.post('/:id/items', function(req, res, next) {
  req.order.addToOrder(req.body.price, req.body.productID, req.body.quantity).then(function(order){
      res.status(201).json(order);
  }).then(null, next);
})

router.put("/:id", function(req, res, next){
  delete req.body._id;
  _.extend(req.order, req.body);
  req.order.save().then(function(order){
    res.status(200).json(order)
  }).then(null, next);
})

router.delete("/:id", function(req, res, next){
  req.order.remove()
  .then(function(){
    res.sendStatus(204);
  })
  .then(null, next);
})


module.exports = router;
