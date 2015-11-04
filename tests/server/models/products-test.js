var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');

xdescribe('Product model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Product).to.be.a('function');
    });

    describe('product validation', function (){

        describe('required fields', function () {

            it('requires title', function (done) {
                var product = new Product({
                    description: 'Some cool stuff',
                    price: 12.99,
                    quantity: 10,
                    category: ["Tag1"]
                  })

                // GTPT: promises plz
                  product.save(function (err, savedproduct){
                    expect(err.message).to.equal('Product validation failed');
                    done();
                  })

            });

// GTPT: you don't need to test mongoose's validations
            it('requires description', function (done){
                var product = new Product({
                  title: "Some cool thing",
                  price: 12.99,
                  quantity: 10,
                  category: ["Tag1"]
                })

                product.save(function (err, savedProduct){
                  expect(err.message).to.equal('Product validation failed');
                  done();
                })
            })

            it('requires price', function (done){
              var product = new Product({
                title: "Something cool",
                description: "Some more cool",
                quantity: 10,
                category: ["Tag1"]
              })

              product.save(function (err, savedProduct){
                expect(err.message).to.equal('Product validation failed');
                done();
              })
            })

            it('requires quantity value', function (done){
                var product = new Product({
                  title: "Something cool",
                  description: "Some more cool",
                  price: 12.99,
                  category: ["Tag1"]
                })

              product.save(function (err, savedProduct){
                expect(err.message).to.equal('Product validation failed');
                done();
              })
            })

            it('requires at least one category', function (done){
                var product = new Product({
                  title: "Something cool",
                  description: "Some more cool",
                  price: 12.99,
                  category: []
                })

                product.save(function (err, savedProduct){
                  expect(err.message).to.equal('Product validation failed');
                  done();
                })
            })

        });

        describe('unique fields', function(){

          it('requires title to be unique', function (done){
                var productOne = new Product({
                  title: "Something cool",
                  description: "Some more cool",
                  price: 12.99,
                  category: ["saved"]
                })

                productOne.save();

                var productTwo = new Product({
                  title: "Something cool",
                  description: "This shouldn't be saved!",
                  price: 13.99,
                  category: ["not saved"]
                })

                productTwo.save(function (err, savedProduct){
                  expect(err.message).to.equal("Product validation failed");
                  done();
                })
          });
        })

        // Remember pre-save hooks!

        describe('default photo assigned if no photo submitted', function(){
          it('document should have a photo url assigned', function (done){
                var productOne = new Product({
                  title: "Something cool",
                  description: "Some more cool",
                  quantity: 2,
                  price: 12.99,
                  category: ["saved"]
                })

                productOne.save(function (err, savedProduct){
                  if (err) done(err);
                  expect(typeof savedProduct.photo).to.equal('string');
                  done();
                })
          })
        })

    });

});
