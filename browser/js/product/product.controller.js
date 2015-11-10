app.controller('ProductCtrl', function ($scope, theUser, theProduct, UserFactory, AuthService,$uibModal, OrderFactory, $timeout, WishlistFactory, $cookies){
   var product = theProduct;
   $scope.product = product;

   $scope.wlAdded, $scope.notLoggedIn, $scope.added,$scope.creating = true;

   console.log('USER', theUser.wishlist)


   console.log("COOKIES", $cookies.getAll())
   if (theUser) $scope.user = theUser;

   // GTPT: where's the review logic?
   $scope.$on('reviewAdded', function(event, data){
      $scope.product = data;
   })

   $scope.addWishList = function(){
   	console.log("HI", $scope.user)
        if ($scope.user){
	        if ($scope.creating){
	        	WishlistFactory.createWishlist($scope.user, {
	        		items: {price: product.price, product: product._id, quantity: $scope.order.number},
	        		wlName: $scope.newWishlistName
	        	})
	        }
	        else {
	        	WishlistFactory.addToWishlist($scope.user, $scope.wlName._id, {
	        		price: product.price,
	        		quantity: $scope.order.number,
	        		product: product._id
	        	})
	        }
            $scope.wlAdded = true;

            // beauty in the eye of the beholder
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
        // GTPT: this feels a bit like a factory thing
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
	    }else{
    		console.log("Please sign in");
        	return "Please sign up or login to create a review.";
    	}
    };


	$scope.product.price = $scope.product.price / 100;

	$scope.addToOrder = function() {
		$scope.added = true;
		$timeout(function () { $scope.added = false; }, 2000)
		if (!$cookies.get('order')) {
			OrderFactory.create({items: [{price: $scope.product.price, product: $scope.product._id, quantity: $scope.order.number}]})
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

// GTPT: this file seems too long for a controller file
// GTPT: this probably should go into a file with review in the filename so I can use command + t
app.controller('ModalCtrl', function ($scope, $rootScope, $uibModalInstance, ProductFactory, product, user){

  $scope.max = 5;

  $scope.ratingStates = [{
    stateOn: 'glyphicon-star',
    stateOff: 'glyphicon-star-empty'
  }];

	$scope.ok = function(){
    ProductFactory.createReview({product:product._id, user: user._id, content: $scope.review.content, numStars:$scope.review.stars })
    .then(function(data){
      // GTPT: maybe a socket might be better?
      // GTPT: or product.reviews.push or something
      $rootScope.$broadcast('reviewAdded', data);
      $uibModalInstance.close()
    })

	}
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel')
	}




})
