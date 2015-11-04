// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Product Route', function () {

	var createProduct = function(){
		return Product.create({title: "book", description: "reading", price : 45, quantity:1, category : ['books']})
	}

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('/ methods', function () {
		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});


		it('should get all products', function (done){
			createProduct().then(function(product){
				guestAgent.get('/api/products')
				.expect(200)
				.expect(function(res){
					expect(res.body[0].title).to.equal('book')
				}).end(done)
			}).then(null, done)

		})
		it("should post to create new product", function (done){
			guestAgent.post('/api/products')
        .send({title: "chocolate", description: "reading", price : 45, quantity:1, category : ['books']})
			.expect(201)
			.expect(function(res){
				expect(res.body.title).to.equal('chocolate')

			}).end(done)

		})

	});

	describe('/category methods', function(){
		 var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

	    it('should get all categories', function (done){
	    	createProduct().then(function(product){
	         guestAgent.get('/api/products/category')
	           .expect(200)
	           .expect(function(res){
	           	 expect(res.body[0]).to.equal('books')
	           }).end(done)
	    	}).then(null, done)

	    })
       it('should get all product from query category', function (done){
       	 createProduct().then(function(product){
       	 	   guestAgent.get('/api/products/category?category=books')
       	 	   .expect(200)
       	 	   .expect(function(res){
       	 	   	  expect(res.body[0].title).to.equal('book')
       	 	   }).end(done)
       		 }).then(null, done)

       })

	});

	describe('/:id methods', function () {
		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});
      it('should get one product by Id', function (done){

      	  createProduct().then(function(product){
             guestAgent.get('/api/products/'+ product._id)
             .expect(200)
             .expect(function(res){
             	expect(res.body.title).to.equal('book')
             })
             .end(done)
      	  }).then(null, done)
      })
      it('should update product by Id', function (done){
      	  createProduct().then(function(product){
      	  	 guestAgent.put('/api/products/'+ product._id)
             .send({title: "Mac and Cheese"})
      	  	 .expect(201)
      	  	 .expect(function(res){
      	  	 	expect(res.body.title).to.equal("Mac and Cheese")

      	  	 }).end(done)
      	  }).then(null, done)
      })
      it('should delete product by Id', function (done){
      	  createProduct().then(function(product){
      	  	 guestAgent.delete('/api/products/'+ product._id)
      	  	 .expect(200)
      	  	 .expect(function(res){
      	  	 	 Product.findById(product._id).then(function(res){
      	  	 	 	expect(res).to.be.falsey
      	  	 	 })

      	  	 }).end(done)
      	  }).then(null, done)
      })


	});

});
