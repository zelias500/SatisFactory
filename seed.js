/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Product = Promise.promisifyAll(mongoose.model('Product'));
var Category = Promise.promisifyAll(mongoose.model('Category'))
var _ = require('lodash');

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus',
            isAdmin: true
        },
        {
            email: 'someone@somewhere.com',
            password: 'password'
        }

    ];

    return User.createAsync(users);

};

var seedProducts = function() {

    var products = [
        {
            title: "Buy a Ferrari",
            description: "Purchase a Ferrari F430 at a heavily discounted price. Vroom vroom.",
            price: 100000.00,
            quantity: 10,
            category: "Cars",
            photo: "/photos/ferrari.png"
        },
        {
            title: "Buy a Porsche 911",
            description: "Indulge your need for speed by buying a limited edition Porsche 911, only available at Satis-Factory.",
            price: 50000.00,
            quantity: 10,
            category: "Cars",
            photo: "/photos/Porsche.jpeg"
        },

        {
            title: "Max Brenner Specialty Chocolate",
            description: "Satisfy your craving for chocolate with the a year's supply of New York's favourite chocolate pizza",
            price: 999.99,
            quantity: 100,
            category: "Food",
            photo: "/photos/MaxBrenner.JPG"
        },

        {
            title: "Hershey Bar",
            description: "Because satisfaction doesn't need to be big or expensive...",
            price: 3.99,
            quantity: 10000,
            category: "Food",
            photo: "/photos/hershey.jpg"
        },

        {
            title: "Meet Grumpy Cat",
            description: "Sometimes, nothing beats a bad day except spreading the grumpy around...mee-ow.",
            price: 500.00,
            quantity: 4,
            category: "Experiences",
            photo: "/photos/grumpycat.png"
        },
        {
            title: "Dinner with Omri Bernstein",
            description: "A once in a lifetime experience- dinner with esteemed time traveller and software engineer, Omri Bernstein DFC.",
            price: 2000.00,
            quantity: 2,
            category: "Experiences",
            photo: "/photos/omri_bernstein.jpg"
        },
        {
            title: "Luxury vacation to the Seychelles",
            description: "Pure white sand, tropical sun and idyllic island life, an experience to really recharge miles away from the city.",
            price: 12000.00,
            quantity: 10,
            category: "Vacations",
            photo: "/photos/Fishing.jpg"
        },

        {
            title: "Swiss Snowboarding",
            description: "Fresh powder, endless runs and Swiss Chocolate. Nothing beats the ultimate European snowboarding experience",
            price: 15000.00,
            quantity: 20,
            category: "Vacations",
            photo: "/photos/snowboarding.jpg"
        },

        {
            title: "The Ultimate Spa experience",
            description: "Eliminate all the aches and pains of city life by indulging in a spa experience like no other at the Kempinksi Spa",
            price: 2000.00,
            quantity: 12,
            category: "Services",
            photo: "/photos/Spa.jpg"
        },

        {
            title: "House Makeover",
            description: "House a mess? Apartment run down? Use our specialist interior designers and contractors to reinvigorate your pad.",
            price: 10000.00,
            quantity: 15,
            category: "Services",
            photo: "/photos/house.jpg"
        },
        {
            title: "Superbowl 2016 - VIP",
            description: "You're going to the superbowl...why settle for less? Satisfy your fan fever and watch the game from our exclusive private box.",
            price: 5000.00,
            quantity: 1,
            category: "Sports",
            photo: "/photos/Superbowl.jpg"
        },
        {
            title: "Pickup Basketball with the man himself...",
            description: "Want to satisfy your dream of meeting the world's best basketball player...AND try to beat him at his own game? This one is for you.",
            price: 60.00,
            quantity: 20,
            category: "Sports",
            photo: "/photos/LeBron.jpg"
        },

        {
            title: "Phish...with a difference",
            description: "Phish, if you want to see them, why not meet them as well? Watch the band, then meet up with them backstage for the afterparty!",
            price: 100.00,
            quantity: 10,
            category: "Concerts",
            photo: "/photos/Phish.jpg"
        },

        {
            title: "Hang out Jay-Z",
            description: "What's better than going to see Jay - Z? Hanging with the man himself and watching from the stage.",
            price: 150.00,
            quantity: 10,
            category: "Concerts",
            photo: "/photos/jayz.jpg"
        }

    ]

    return Category.find({}).then(function(categories){
         return products.map(function(element){
               for(var i=0 ; i<categories.length; i++){
                  if(element.category == categories[i].name){
                      element.category = categories[i]._id
                  }
               }
               return element;
         })
    }).then(function(updateProduct){
        return Product.createAsync(updateProduct);
    })


};

var seedCategories = function(){
    var category = [
       {name: "Cars"},
       {name: "Food"},
       {name: "Experiences"},
       {name: "Vacations"},
       {name: "Services"},
       {name: "Sports"},
       {name: "Concerts"}
    ]
    return Category.createAsync(category);
}

connectToDb.then(function (db) {

    User.findAsync({}).then(function (users) {
        User.remove()
        .then(function(){
            return seedUsers();
        })
        .then(function(){
            return Category.remove()
            .then(function(){
                return seedCategories();
            })
        })
        .then(function(){
            return Product.remove()
            .then(function(){
                return seedProducts()
            });
        })
        .then(function(){
            var productsToUse;
            return Product.find({})
            .then(function(products){
                productsToUse = products;

                return Category.find({})
                .then(function(categories){
                    return categories.map(function(category){
                        for(var i = 0; i < productsToUse.length; i++){
                            if(productsToUse[i].category == category.id){
                                category.products.addToSet(productsToUse[i]);
                            }
                        }
                        return category;
                    })
                })
                .then(function(categories){
                    return Promise.all(categories.map(function(cat){
                        return cat.save();
                        })
                    );
                })
            })
        })
        .then(function(){
            console.log(chalk.green("All data has been seeded."));
            process.kill(0);
        })
        .catch(function(err){
            console.log(chalk.magenta(err));
            process.kill(1);

        })

    })


});
