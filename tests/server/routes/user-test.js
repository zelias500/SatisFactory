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

describe('Users Route:', function (){

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

  var user;

  beforeEach('Create an existing user', function() {
    user = new User({ email: "someone@something.com"})
  })

  describe('GET /users', function (){

    
    it("gets all users with a 200 response and an array as the body", function (done){
      guestAgent.get('/api/users')
        .expect(200)
        .end(function(err, response){
          if(err) return done (err);
          expect(response.body).to.be.an.instanceOf( Array );
          done();
        })
    })

    it('gets information on a single user with a 200 response', function (done){
      guestAgent.get('/api/users/' + user._id)
        .expect(200)
        .end(function(err, response){
          if(err) done(err);
          expect(response.body.email).to.be("someone@something.com")
          done();
        })
    })

    it('get one that does not exist', function (done){
      guestAgent.get('/api/users/1sh0uldn0tex1st')
        .expect(404)
        .end(done)
    })

    it('gets a user by their email with a 200 response', function (done){
        guestAgent.get('/api/users/email/' + user._id)
          .expect(200)
          .end(function(err, response) {
            if (err) done(err);
            expect(response.body.email).to.be('someone@something.com')
            done();
          })
  })

  })

  describe('POST /users', function() {
    // var guestAgent;
    // beforeEach('Create guest agent', function() {
    //   guestAgent = supertest.agent(app)
    // })

    it('creates a new user', function(done) {
      guestAgent.post('/api/users/')
          .send({email: 'silvia@silvia.com'})
        .expect(201)
        .end(function(err, response) {
          if (err) done(err);
          expect(response.body.email).to.be('silvia@silvia.com')
          done()
        })
    })

  })

  describe('PUT /users', function() {

    it('updates an existing users details', function (done){
      guestAgent.put('/api/users/' + user._id)
        .send({ password: "somepassword" })
        .expect(200)
        .end(function(err, response){
          if(err) done(err);
          expect(response.body.password).to.be("somepassword");
          done();
        })
    })

    it('does not update a user that does not exist', function (done) {
      guestAgent.put('/api/users/1sh0uldn0tex1st')
        .expect(404)
        .end(done)
    })

  })

  describe('DELETE /users', function() {
    it('removes an existing user', function (done) {
      guestAgent.delete('/api/users/' + user._id)
        .expect(204)
        .end(function (err, response){
          User.findById(user._id)
            .then(function(user){
              expect(user).to.be.null;
              done()
            })
        })
    });

    it('does not delete a user that does not exist', function (done) {
      guestAgent.delete('/api/users/1sh0uldn0tex1st')
        .expect(404)
        .end(done)
    })

  })

  describe('GET /users/:id/orders', function() {
    it('retrieves all orders by a single user', function (done) {

      Product.create({
        title: "SomeCoolStuff",
        description: "So F****N cool",
        price: 9.99,
        quantity: 5000,
        category: ["CoolS**t"]
      })
      .then(function(product){
        return Order.create({ 
          user: user._id,
          item: [{
            price: 9.99,
            productId: product._id,
            quantity: 1
          }],
          status: 'pending'
        });

        }).then(function(order){
          guestAgent.get("/api/users/" + user._id + "/orders")
          .expect(200)
          .end(function(err, response) {
            if(err) return done(err);
            expect(order.item.length).to.equal(1);
            done();
          });
        })
      })
  })

  describe('GET /users/:id/reviews', function(){ 
    it("should get all reviews by a single user", function (done) {
      Product.create({
        title: "SomeCoolStuff",
        description: "So F****N cool",
        price: 9.99,
        quantity: 5000,
        category: ["CoolS**t"]
      })  
      .then(function(product){
        return Review.create({
          product: product._id,
          user: user._id,
          content: "Blahblahblah, was very good"
        })
      })
        .then(function(review){
          console.log(review);
          guestAgent.get("/api/users/" + user._id + "/reviews")
          .expect(200)
          .end(function(err, response){
            if(err) done(err);
            expect(user.reviews.length).to.equal(1);
            done();
          })
        })
      })
    })
  });

