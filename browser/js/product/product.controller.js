app.controller('ProductCtrl', function ($scope, Session, theProduct, UserFactory, AuthService){
   var product = theProduct;
   $scope.product = product;


   $scope.addWishList = function(){

   	    var user = AuthService.getCurrentUser();
        if(user && user.id){
        return UserFactory.addToWishlist(user,{price : product.price, product: product._id, quantity:product.quantity})}
        else{
        	console.log("Please sign in");
        	return "Please sign up or login to create a wishlist.";
        }
    }


})
