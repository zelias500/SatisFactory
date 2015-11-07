app.controller('ProductCtrl', function ($scope, Session, theProduct, UserFactory, AuthService,$uibModal){
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

    $scope.addProductReview = function(){
    	console.log("here")
    	$uibModal.open({
           animation: $scope.animationEnabled,
           templateUrl: "/js/product//product.review.template.html",
           controller: "ModalCtrl",
           resolve: {
           	  product: function(){
           	  	  return theProduct
           	  }
           }
    	})
    }


})


app.controller('ModalCtrl', function($scope,$uibModalInstance, ProductFactory, product){

	$scope.ok = function(){
        console.log($scope.review)
        ProductFactory.createReview({product:product._id, content: $scope.review.content, numStars:$scope.review.stars })
		$uibModalInstance.close()
	}
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel')
	}


})