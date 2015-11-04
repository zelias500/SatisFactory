// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Order = mongoose.model('Order');
var User = mongoose.model('User');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

xdescribe('Orders Route', function () {

	var guestAgent;
	var createOrder = function(){
		var userID, productID;
		return User.create({email:"zack@zack.com"}).then(function(user){
			userID = user._id;
			return Product.create({title: "book", description: "reading", price : 45, quantity:1, category : ['books']})
		}).then(function(product){
			productID = product._id;
			return Order.create({user:userID, item:[{
				price: 20,
				productId: productID,
				quantity: 6
			}]})
		})
	}

	beforeEach('Establish DB connection and create guest agent', function (done) {
		guestAgent = supertest.agent(app);
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done);
	});

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('/ methods', function(){

		it('should get all orders', function(done){
			createOrder().then(function(){
				guestAgent.get('/api/orders')
				.expect(200)
				.expect(function(res){
					expect(res.body[0].item[0].price).to.equal(20)
				}).end(done)
			}).then(null, done)
		});

		it('should create an order with a post request', function(done){
			var userID, productID;
			createOrder().then(function(order){
				userID = order.user;
				productID = order.item[0].productId;
				guestAgent.post('/api/orders', {user:userID, item:{price: 10, productId: productID, quantity: 50}})
				.expect(201)
				.expect(function(res){
					expect(res.body.user).to.equal(userID)
				}).end(done)
			}).then(null, done);
		})

	})

	describe('/:id methods', function(){
		it('should get an order by id', function(done){
			createOrder().then(function(order){
				guestAgent.get('/api/orders/'+order._id)
				.expect(200)
				.expect(function(res){
					expect(res.body[0].item[0].price).to.equal(20);
				}).end(done)
			}).then(null, done)
		})

		it('should add a product to an order with a post request', function(done){
			createOrder().then(function(order){
				guestAgent.post('/api/orders/'+order._id, {price: 10, productId: order.item[0].productId, quantity: 60})
				.expect(201)
				.expect(function(res){
					expect(res.body.item[1].price).to.equal(10)
				})
				.end(done)
			}).then(null, done)
		})

		it('should modify an order by id', function(done){
			createOrder().then(function(order){
				guestAgent.put('/api/orders/'+order._id, {shipTo: '123 Fake Street'})
				.expect(200)
				.expect(function(res){
					expect(res.body.shipTo).to.equal('123 Fake Street');
				})
				.end(done)
			}).then(null, done)
		})

		it('should delete an order', function(done){
			createOrder().then(function(order){
				guestAgent.delete('/api/orders/'+order._id)
				.expect(200)
				.expect(function(res){
					Order.findById(order._id).then(function(order){
						expect(order).to.be.falsey
					})
				}).end(done)
			}).then(null, done)
		})

	})
});
