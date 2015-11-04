'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var Review = require('./review');
var Schema = mongoose.Schema;

var validEmailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

var Address = new Schema({
    name: {type: String, required: true },
    lineOne: { type: String, required: true }, 
    lineTwo: String,
    city: { type: String, required: true }, 
    zip: { type: Number, required: true }, 
    state: { type: String, required: true}
})

var Billing = new Schema({
    address: {type: Address },
    number: { type: String, required: true }, 
    exp_month: { type: Number, required: true }, 
    exp_year: { type: Number, required: true }, 
    cvc:  { type: String, required: true }
})



var schema = new Schema({
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

    billing: [Billing],

    shipping: [Address]

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

schema.virtual("billing").get(function(){
    this.billing.forEach(function(cc){
        cc.number = "************" + cc.number.slice(-4);
    })
    return this.billing;
})

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


schema.method('addBillingOption', function(card){
    this.billing.push(card); 
    this.save();
})

schema.method('addShippingAddress', function(address){
    this.shipping.push(address);
    this.save();
})



mongoose.model('User', schema);
