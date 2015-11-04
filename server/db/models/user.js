'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var Review = require('./review');
var Schema = mongoose.Schema;

var validEmailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

var schema = new Schema({
    // GTPT: what about name?
    email: {
        type: String,
        unique: true,
        // GTPT: you could use https://github.com/SamVerschueren/node-mongoose-validator
        // for this so you don't have to maintain the regex yourself
        validate: {
            validator: function(v){
                return validEmailRegex.test(v);
            },
            message: "Email is invalid"

        }
    },
    password: {// GTPT: setter?
        type: String,
        select: false
    },
    salt: {
        type: String,
        select: false
    },
    twitter: {
        id: String,
        username: String,
        token: String,
        tokenSecret: String
    },
    facebook: {
        id: String
    },
    google: {
        id: String
    },
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],

    billing: Array, // GTPT: an array of what?
    // GTPT: you could make a getter on credit card number to *** out all but the last 4 digits

    shipping: Array // GTPT: an array of what?

    // GTPT: maybe you want an address schema? credit card schema?

});
// GTPT: how are you indicating admin users?


// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
    var hash = crypto.createHash('sha1');
    hash.update(plainText);
    hash.update(salt);
    return hash.digest('hex');
};

schema.pre('save', function (next) {

    if (this.isModified('password')) {
        this.salt = this.constructor.generateSalt();
        this.password = this.constructor.encryptPassword(this.password, this.salt);
    }

    next();

});


schema.statics.generateSalt = generateSalt;
schema.statics.encryptPassword = encryptPassword;

schema.method('correctPassword', function (candidatePassword) {
    return encryptPassword(candidatePassword, this.salt) === this.password;
});

// GTPT: this seems like an unnecessary method
// also it doesn't save
schema.method('addBillingOption', function(card){
    this.billing.push(card); // GTPT: addToSet
    return card;
})

// GTPT: ditto
schema.method('addShippingAddress', function(address){
    this.shipping.push(address);
    return address;
})



mongoose.model('User', schema);
