var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Order = mongoose.model('Order');

describe('Order model', function () {

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
           beforeEach('Create User', function (done) {
                var userId;
                var user  = new User({email:"jellyqq@gmail.com"})
                user.save(function(err, saveduser){
                  userId = saveduser._id
                })
                done();         
           });

            it('requires user or sessionId', function (done) {
               var productId;
               var product = new Product({ 
                    description: 'Some cool stuff',
                    price: 12.99,
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
                    user: userId;
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
                 savedProduct.remove()
              })

              var order = new Order({
                   user: userId;
                   item:[{price: 15, productId:productId, quantity: 5}]
              })
              order.save(function (err, savedorder){
                  expect(err.message).to.equal('Order validation failed');
                  done();
            })
            it('should keep price of item even when product price changes', function (done){
              var productId;
              var product = new Product({
                title: "Something cool",
                description: "Some more cool",
                quantity: 10,
                price :14,
                category: ["Tag1"]
              })

              product.save(function(err, savedProduct){
                 productId = savedProduct._id
              });

              var order = new Order({
                   user: userId;
                   item:[{price: 14, productId:productId, quantity: 5}]
              })

              var orderId;
              order.save(function(err, savedorder){
                orderId = savedorder._id
              };

              product.findByIdAndUpdate(productId, {price: 16})

              order.findbyId(orderId).then(function(order){
                 expect(order.item[0].price).to.equal(14)
              })
                        

            })

            
    });

});