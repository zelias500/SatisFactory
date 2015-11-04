var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Order = mongoose.model('Order');

describe('User model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });
   
    var createUser = function () {
        return User.create({ email: 'obama@gmail.com', password: 'potus' });
    };

    it('should exist', function () {
        expect(User).to.be.a('function');
    });

    it('should start as a regular user', function (done){
        createUser().then(function (user) {
            expect(user.isAdmin).to.be.falsey;
            done();
        }).then(null, done)
    });

    it('should only accept valid email addresses', function(done){
        var user = new User();
        user.email = 'hello';
        user.validate(function(err){
            expect(err.errors.email.message).to.equal('Invalid Email')
            done();
        })
    })

    it('should only have unique email addresses', function(done){
        createUser()
        .then(function(user){
            var newUser = new User();
            newUser.email = 'obama@gmail.com';
            return newUser.save()
        })
        .then(function(user){
            done();    
        })
        .then(null, function(err){
             expect(err.message.match(/duplicate key error/g).length).to.equal(1);
             done();
        });
    })


    describe('reviews', function() {

        it('should be an array', function(done) {
            createUser().then(function(user){
                expect(Array.isArray(user.reviews)).to.be.true;
                done();
            }).then(null, done);
        });

        it('should reference Review model objects', function(done) {
            createUser().then(function(user){
                return Review.create({name: user.name, content: "shfksdfhwkhe"})
            })
            .then(function(){
                done();
            })
            .then(null, done);
        });

    });

    describe('$$ dolla dolla bill yall $$', function() {

        it('should be an array of objects', function(done){
            createUser().then(function(user){
                expect(Array.isArray(user.billing)).to.be.true;
                done();
            }).then(null, done)
        })

        it('should have a method that adds credit card information', function(done){
            createUser().then(function(user) {
                var cc = {
                    type: "Visa",
                    number: "123123123123123",
                    name: "Silvia",
                    address: "123 Fake Street",
                    zip: "10021",
                    expiration: "01/42",
                    code: "789",
                    city: "New York",
                    state: "NY"
                }
                user.addBillingOption(cc);
                return user;
            }).then(function (user) {
                expect(user.billing[0].name).to.be.equal('Silvia');
                done();
            }).then(null, done);
        })

    });

    describe('shipping addresses', function () {
        it('should store addresses using a method', function(done){
            createUser().then(function(user){
                var address = {
                    name: "Zack",
                    address: "124 Fake Street",
                    zip: "10099",
                    city: "New York",
                    state: "NY"
                }
                user.addShippingAddress(address);
                return user;
            }).then(function (user) {
                expect(user.shipping[0].name).to.be.equal('Zack');
                done();
            }).then(null, done);
        })
    });

    describe('password encryption', function () {

        describe('generateSalt method', function () {

            it('should exist', function () {
                expect(User.generateSalt).to.be.a('function');
            });

            it('should return a random string basically', function () {
                expect(User.generateSalt()).to.be.a('string');
            });

        });

        describe('encryptPassword', function () {

            var cryptoStub;
            var hashUpdateSpy;
            var hashDigestStub;
            beforeEach(function () {

                cryptoStub = sinon.stub(require('crypto'), 'createHash');

                hashUpdateSpy = sinon.spy();
                hashDigestStub = sinon.stub();

                cryptoStub.returns({
                    update: hashUpdateSpy,
                    digest: hashDigestStub
                });

            });

            afterEach(function () {
                cryptoStub.restore();
            });

            it('should exist', function () {
                expect(User.encryptPassword).to.be.a('function');
            });

            it('should call crypto.createHash with "sha1"', function () {
                User.encryptPassword('asldkjf', 'asd08uf2j');
                expect(cryptoStub.calledWith('sha1')).to.be.ok;
            });

            it('should call hash.update with the first and second argument', function () {

                var pass = 'testing';
                var salt = '1093jf10j23ej===12j';

                User.encryptPassword(pass, salt);

                expect(hashUpdateSpy.getCall(0).args[0]).to.be.equal(pass);
                expect(hashUpdateSpy.getCall(1).args[0]).to.be.equal(salt);

            });

            it('should call hash.digest with hex and return the result', function () {

                var x = {};
                hashDigestStub.returns(x);

                var e = User.encryptPassword('sdlkfj', 'asldkjflksf');

                expect(hashDigestStub.calledWith('hex')).to.be.ok;
                expect(e).to.be.equal(x);

            });

        });

        describe('on creation', function () {

            var encryptSpy;
            var saltSpy;

            beforeEach(function () {
                encryptSpy = sinon.spy(User, 'encryptPassword');
                saltSpy = sinon.spy(User, 'generateSalt');
            });

            afterEach(function () {
                encryptSpy.restore();
                saltSpy.restore();
            });

            it('should call User.encryptPassword with the given password and generated salt', function (done) {
                createUser().then(function () {
                    var generatedSalt = saltSpy.getCall(0).returnValue;
                    expect(encryptSpy.calledWith('potus', generatedSalt)).to.be.ok;
                    done();
                });
            });

            it('should set user.salt to the generated salt', function (done) {
               createUser().then(function (user) {
                   var generatedSalt = saltSpy.getCall(0).returnValue;
                   expect(user.salt).to.be.equal(generatedSalt);
                   done();
               });
            });

            it('should set user.password to the encrypted password', function (done) {
                createUser().then(function (user) {
                    var createdPassword = encryptSpy.getCall(0).returnValue;
                    expect(user.password).to.be.equal(createdPassword);
                    done();
                });
            });

        });

    });

});
