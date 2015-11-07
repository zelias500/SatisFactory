app.controller('ProductCtrl', function ($scope, theProduct, UserFactory){
   var product = theProduct;
   $scope.product = product;
   $scope.addWishList = function(){
        UserFactory.addToWishlist()
   }

   


})
