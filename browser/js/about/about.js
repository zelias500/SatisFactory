// diff since last time: https://github.com/zelias500/SatisFactory/compare/61c6fa2936b5a3d959c0e5b1eabb1c59f45818e5...561928e02da4a3f55af818efcf2ac388f14bf8f2


app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope, FullstackPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FullstackPics);

});
