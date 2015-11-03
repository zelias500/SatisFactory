var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Product = mongoose.model('Product');

describe('Review Model', function() {

	beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    var createReview = function(){
    	var theUser;
    	return User.create({ email: 'obama@gmail.com', password: 'potus' })
    			.then(function(user) {
    				theUser = user;
    				return Product.create({name: "chocolate"})
    			})
    			.then(function(product) {
    				return Review.create({user: theUser._id, product: product._id, content: "badblablabalbal", numStars: 5})
    			})

    }

    it('reviews must belong to a product', function(done) {
        	createReview().then(function(review) {
        		return Product.findById(review.product)
        	}).then(function(product){
        		expect(product.name).to.equal('chocolate');
        		done();
        	}).then(null, done);
    });

    it('reviews must belong to a user', function(done) {
        	createReview().then(function(review) {
        		return User.findById(review.user)
        	}).then(function(user){
        		expect(user.email).to.equal('obama@gmail.com')
        		done();
        	}).then(null, done);
    });

    it('should require content', function(done){
    	createReview().then(function(review){
            review.content ="";
            return review.save()
    		//return review.validate()
    	}).then(done)
        .then(null, function(err){
            expect(err.name).to.equal('ValidationError');
            done()
        });
    });

    it('errors if it has content with length <10 characters', function(done){
    	createReview().then(function(review){
    		review.content = "DEELISH";
    		review.validate(function(err) {
    			expect(err.errors.content.message).to.equal('Content is invalid')
    		})
    		done();
    	}).then(null, done);
    });

    it('validates content length properly', function(done){
    	createReview().then(function(review){
    		review.content = "DEEEEEEEEEEEEEEEEEEELISH";
    		review.validate(function(err) {
    			expect(err).to.equal(undefined)
    		})

    		done();
    	}).then(null, done);
    })
});