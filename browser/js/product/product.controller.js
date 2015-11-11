app.controller('ProductCtrl', function ($scope, theUser, theProduct, UserFactory, AuthService,$uibModal, OrderFactory, $timeout, WishlistFactory, $cookies){
   var product = theProduct;
   $scope.product = product;

   $scope.wlAdded, $scope.notLoggedIn, $scope.added, $scope.creating = true;

   if (theUser) $scope.user = theUser;

   // GTPT: where's the review logic?
   $scope.$on('reviewAdded', function(event, data){
      $scope.product = data;
   })

   $scope.addWishList = function(){
        if ($scope.user){
        	if ($scope.creating){
	        	if(!$scope.newWishlistName) {
	        		$scope.needName = true;
	        		$timeout(function () { $scope.needName = false; }, 2000)
	        		return;
	        	}
	        	else {
	        		$scope.needName = false;
		        	WishlistFactory.createWishlist($scope.user, {
	        		items: {price: product.price, product: product._id, quantity: $scope.order.number},
	        		wlName: $scope.newWishlistName
	        	})
	        	}}
	        	else {
	        	WishlistFactory.addToWishlist($scope.user, $scope.wlName._id, {
	        		price: product.price,
	        		quantity: $scope.order.number,
	        		product: product._id
	        	})
	        }
            $scope.wlAdded = true;
            $timeout(function () { $scope.wlAdded = false; }, 2000)

        }
        else{
        	$scope.notLoggedIn = true;
        }
    }

    $scope.newWishlist = function(wlName) {
    	if (!wlName){
    		$scope.creating = true;
    	}
		else {
			$scope.creating = false;
		}
    }

    $scope.addProductReview = function(){
    	if($scope.user){ 
	    	$uibModal.open({
	    		animation: $scope.animationEnabled,
	    		templateUrl: "/js/product/product.review.template.html",
	    		controller: "ModalCtrl",
	    		resolve: {
	    			product: function(){
	    				return theProduct
	    			},
	    			user : function(){
	           	  	return $scope.user;
	           	  }
	           	}
	    	})
	    }
	    else {
        	return "Please sign up or login to create a review.";
    	}
    };


	$scope.product.price = $scope.product.price / 100;

	$scope.addToOrder = function() {
		$scope.added = true;
		$timeout(function () { $scope.added = false; }, 2000)
		if (!$cookies.get('order')) {
			OrderFactory.create({ order: {items: [{price: $scope.product.price, product: $scope.product._id, quantity: $scope.order.number}]}, user: $scope.user })
				.then(function(createdOrder) {
					$cookies.put('order', createdOrder._id);
				})
			}
				else {
			OrderFactory.addOrderItem($cookies.get('order'), {
				price: $scope.product.price, product: $scope.product._id, quantity: $scope.order.number
			})
		}
	}
})


