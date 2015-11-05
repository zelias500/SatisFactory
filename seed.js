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

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};

var seedProducts = function() {
    
    var products = [
        {
            title: "Buy a Ferrari",
            description: "Purchase a Ferrari F430 at a heavily discounted price",
            price: 100000.00,
            quantity: 10,
            category: "Cars",
            photo: "/public/photos/ferrari.png"
        }, 
        {
            title: "Buy a Porsche 911",
            description: "Indulge your need for speed by by a limited edition Porsche 911 at a discounted price.",
            price: 50000.00,
            quantity: 10,
            category: "Cars",
            photo: "/public/photos/Porsche.jpeg"  
        },

        {
            title: "Max Brenner Speciality Chocolate",
            description: "Satisfy your craving for chocolate with the a years supply of New York's favourite chocolate pizza",
            price: 999.99,
            quantity: 100,
            category: "Food",
            photo: "/public/photos/MaxBrenner.JPG" 
        },

        {
            title: "Hershey Bar",
            description: "Because satisfaction doesn't need to be big or expensive...",
            price: 3.99,
            quantity: 10000,
            category: "Food",
            photo: "/public/photos/hershey.jpg" 
        },

        {
            title: "Meet Grumpy Cat",
            description: "Sometimes, nothing beats a bad day except spreading the grumpy around...",
            price: 500.00,
            quantity: 4,
            category: "Experiences",
            photo: "/public/photos/grumpycat.png" 
        },        
        {
            title: "Dinner with Omri Bernstein",
            description: "A once in a lifetime experience, dinner with esteemed time traveller and software engineer, Omri Bernstein DFC.",
            price: 2000.00,
            quantity: 2,
            category: "Experiences",
            photo: "/public/photos/omri_bernstein.jpg"
        }, 
        {
            title: "Luxury vacation to the Seychelles",
            description: "Pure white sand, tropical sun and idyllic island life, an experience to really recharge miles away from the city.",
            price: 12000.00,
            quantity: 10,
            category: "Vacations",
            photo: "/public/photos/Fishing.jpg"  
        },

        {
            title: "Swiss Snowboarding",
            description: "Fresh powder, endless runs and Swiss Chocolate, nothing beats a European snowboarding experience",
            price: 15000.00,
            quantity: 20,
            category: "Vacations",
            photo: "/public/photos/snowboarding.jpg"  
        },

        {
            title: "The ultimate Spa experience",
            description: "Eliminate all the aches and pains of city life by indulging in a spa experience like no other at the Kempinksi Spa",
            price: 2000.00,
            quantity: 12,
            category: "Services",
            photo: "/public/photos/Spa.jpg"  
        },

        {
            title: "House Makeover",
            description: "House a mess? Apartment run down? Use our specialist interior designers and contractors to reinvigorate your pad.",
            price: 10000.00,
            quantity: 15,
            category: "Services",
            photo: "/public/photos/house.jpg"  
        },        
        {
            title: "Superbowl 2016 - VIP",
            description: "Your going to the superbowl...why settle for less. Satisfy your fan fever and watch the game from our exclusive private box.",
            price: 5000.00,
            quantity: 1,
            category: "Sports",
            photo: "/public/photos/Superbowl.jpg"
        }, 
        {
            title: "Pickup Basketball with the man himself...",
            description: "Want to satisfy your dream of meeting the worlds best basketball player...and try and beat him at his own game? This is for you.",
            price: 60.00,
            quantity: 20,
            category: "Sports",
            photo: "/public/photos/LeBron.jpg" 
        },

        {
            title: "Phish...with a difference",
            description: "Phish, if you want to see them, why not meet them as well? Watch the band then meet up with them backstage for the afterparty!",
            price: 100.00,
            quantity: 10,
            category: "Concerts",
            photo: "/public/photos/Phish.jpg"  
        },

        {
            title: "Hang out Jay-Z",
            description: "What's better than going to see Jay - Z, hanging with the man himself and watching from the stage.",
            price: 150.00,
            quantity: 10,
            category: "Concerts",
            photo: "/public/photos/jayz.jpg"  
        }

    ]

    return Product.createAsync(products);
};

connectToDb.then(function () {
    User.findAsync({}).then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    }).then(function () {
        Product.findAsync({}).then(function(products){
            if(products.length === 0){
                return seedProducts();
            } else {
                console.log(chalk.magenta('Seems to already be product data, exiting!'))
                process.kill(0)
            }
        })
       
    })
    .then(function(){
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });


});
