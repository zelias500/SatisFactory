var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Order = mongoose.model('Order');

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

router.post('/:id', function(req, res, next) {
  Order.findByIdAndUpdate(req.order._id, { $addToSet: { item: req.body} })
    .then(function(oldOrder) {
      return Order.findById(oldOrder._id)
    })
    .then(function(newOrder) {
      res.status(201).json(newOrder)
    })
    .then(null, next)
})

router.put("/:id", function(req, res, next){
  Order.findByIdAndUpdate(req.order._id, req.body)
    .then(function(oldOrder) {
      return Order.findById(oldOrder._id)
    })
    .then(function(newOrder) {
      res.status(200).json(newOrder)
    })
    .then(null, next)
})

router.delete("/:id", function(req, res, next){
  req.order.remove()
  .then(function(){
    res.sendStatus(200);
  })
  .then(null, next);
})


module.exports = router;