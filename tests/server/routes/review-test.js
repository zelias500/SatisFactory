// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Order = mongoose.model('Order');
var Product = mongoose.model('Product');
var Review = mongoose.model('Review');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

xdescribe('Review Routes:', function (){

  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  var guestAgent;

  beforeEach('Create guest agent', function () {
    guestAgent = supertest.agent(app);
  });

  var theUser, theproduct, review;

  function createReview() {
    return User.create({ email: "someone@something.com"})
      .then(function(user) {
        theUser = user
        return Product.create({
          title: "SomeCoolStuff",
          description: "So F****N cool",
          price: 9.99,
          quantity: 5000,
          category: ["CoolS**t"]
        })
      })
      .then(function(product) {
        theproduct = product
        return Review.create({
          product: product._id, 
          user: theUser._id, 
          content: "AWESOMESSSSSSSS"
        })       
      })
  }

  describe('GET /review/:id', function() {
    it('can get a single review', function(done) {
      createReview().then(function(review){
        guestAgent.get('/api/review/' + review._id)
        .expect(200)
        .expect(function(res){
          expect(res.body.content).to.equal('AWESOMESSSSSSSS')
        })
        .end(done)
        }).then(null, done)
    })

  })

  describe("POST /review/", function(){
    it("can create a single review", function(done){
      createReview().then(function(review){
        guestAgent.post("/api/review", {
          product: theproduct._id,
          user: theUser._id,
          content: "Somecontent stuff here",
          numStars: 5
        })
        .expect(201)
        .expect(function(res){
          expect(res.body.numStars).to.equal(5);
        })
        .end(done)
      })
      .then(null, done);
    })
  })

  describe("PUT /review/:id", function(){
    it("can update a single review", function(done){
      createReview().then(function(review){
        guestAgent.put("/api/review/" + review._id, {
          content: "Some updated content"
        })
        .expect(200)
        .expect(function(res){
          expect(res.body.content).to.equal("Some updated content")
        })
        .end(done)
      })
      .then(null, done);
    })
  })

  describe("DELETE /review/:id", function(){
    it("can delete a single review", function(done){
      createReview().then(function(review){
        guestAgent.delete("/api/review/" + review._id)
        .expect(200)
        .end(done)
      })
      .then(null, done);
    })
  })
      
})


