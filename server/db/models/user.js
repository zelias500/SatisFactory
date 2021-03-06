'use strict';
var crypto = require('crypto');
var mongoose = require('mongoose');
var Review = require('./review');
var Schema = mongoose.Schema;
var validator = require('node-mongoose-validator');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

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

var lineItemSchema = new Schema({
  price: {type:Number, required:true},
  product: { type: Schema.Types.ObjectId, ref: 'Product', required:true},
  quantity: {type:Number, required:true}
})

var wishlistSchema = new Schema({
    items: [lineItemSchema],
    wlName: {type: String, required: true},
    wishlistedBy: {type: Schema.Types.ObjectId, ref: 'User'}
})

wishlistSchema.plugin(deepPopulate, {});

var schema = new Schema({
    name: String,
    isAdmin: {type: Boolean, default: false},
    email: {
        type: String,
        sparse: true,
        validate: validator.$isEmail({msg: "Invalid Email"})
    },
    password: {
        type: String,
        select: false
        // set: encryptPassword
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

    shipping: [Address],
    billing: [Billing],

    wishlist: [{type: Schema.Types.ObjectId, ref: 'Wishlist'}],

    orders: [{type:Schema.Types.ObjectId, ref: 'Order'}]

});

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

schema.virtual("billing.creditcard").get(function(){
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

mongoose.model('LineItem', lineItemSchema)
mongoose.model('Wishlist', wishlistSchema)
mongoose.model('User', schema);
