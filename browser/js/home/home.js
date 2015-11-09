
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        resolve: {
          theCategories: function(ProductFactory){
            return ProductFactory.getAllCategories(); 
          }
        }
    });
});

app.controller("HomeCtrl", function ($scope, theCategories, $state){
  var categories = theCategories;

  var randomize = function(products){
    return Math.floor(Math.random() * products.length);
  }

  $scope.interval = 2000;

  $scope.slideContent = [];

  $scope.goToCategory = function(category){
    $state.go('categories', { category: category});
  }

  theCategories.forEach(function(cat){
    $scope.slideContent.push({
      image: cat.products[randomize(cat.products)],
      category: cat.name
    });
  })
  console.log($scope.slideContent);
})