var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Order = mongoose.model('Order');
var User = mongoose.model('User');
var Product = mongoose.model('Product');

xdescribe('Order model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });


    it('should exist', function () {
        expect(Order).to.be.a('function');
    });

    describe('order validation', function (){

        describe('required fields', function () {
           var user;
           beforeEach('Create User', function (done) {
                user  = new User({email:"jellyqq@gmail.com"})
                user.save(function(err, saveduser){
                  user = saveduser;
                  done();
                })
           });

            it('requires user or sessionId', function (done) {
               var productId;
               var product = new Product({
                    title: "Some cool thing",
                    description: 'Some cool stuff',
                    price: 12.99, // GTPT: in cents
                    quantity: 10,
                    category: ["Tag1"]
                  })

               product.save(function(err, savedproduct){
                   productId = savedproduct._id
               })

                var order = new Order({
                  item: [{price: 15, productId:productId, quantity: 5}]
                })

                order.save(function (err, savedorder){
                  expect(err.message).to.equal('Order validation failed');
                  done();
                })

            });

            it('requires item', function (done){
                 var order = new Order({
                    user: user._id
                 })

                order.save(function (err, savedorder){
                  expect(err.message).to.equal('Order validation failed');
                  done();
                })
            })

            it('requires valid productId ', function (done){
              var productId;
              var product = new Product({
                title: "Something cool",
                description: "Some more cool",
                quantity: 10,
                price :14,
                category: ["Tag1"]
              })

              product.save(function (err, savedProduct){
                 productId = savedProduct._id
                 return savedProduct.remove()
              }).then(function(){
                var order = new Order({
                     user: user._id,
                     item:[{price: 15, productId:productId, quantity: 5}]
                })

                return order.save();
              }).then(function(order) {
                done();
              }).then(null, function(err){
                  expect(err.message).to.equal('Order validation failed');
                  done(err);
              })

            });

            it('should keep price of item even when product price changes', function (done){
              var productId;
              var product = new Product({
                title: "Something cool",
                description: "Some more cool",
                quantity: 10,
                price :14,
                category: ["Tag1"]
              })

              var orderId;

              product.save()
                .then(function(product) {
                  productId = product._id
                  var order = new Order({
                    user: user._id,
                    item: [{price: 14, productId: productId, quantity: 5}]
                  })
                  return order.save()
                })
                .then(function(order) {
                  orderId = order._id
                  return Product.findByIdAndUpdate(productId, {price: 16})
                })
                .then(function() {
                  return Order.findById(orderId)
                })
                .then(function(order) {
                  expect(order.item[0].price).to.equal(14)
                  done()
                })
                .then(null, done)

            })


        });

    });
});
