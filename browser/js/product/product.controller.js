app.controller('ProductCtrl', function ($scope, Session, theProduct, UserFactory, AuthService,$uibModal, OrderFactory, $timeout, WishlistFactory){
   var product = theProduct;
   $scope.product = product;

   $scope.wlAdded, $scope.notLoggedIn, $scope.added,$scope.creating = true;


   // $scope.theUser = AuthService.getCurrentUser();

// GTPT: this should be a resolve maybe?
   AuthService.getCurrentUser().then(function(user){
    // GTPT: why is everything theWhatever
   	$scope.theUser = user;
   })

   // GTPT: where's the review logic?
   $scope.$on('reviewAdded', function(event, data){
      $scope.product = data;
   })

   $scope.addWishList = function(){
        if ($scope.theUser && $scope.theUser._id){
        	console.log($scope.creating)
	        if ($scope.creating){
	        	console.log("THIS IS OUR USER", $scope.theUser)
	        	WishlistFactory.createWishlist($scope.theUser, {
	        		items: {price: product.price, product: product._id, quantity: $scope.order.number},
	        		wlName: $scope.newWishlistName
	        	}).then(function(wl){
	        		console.log(wl);
	        	})
	        }
	        else {
            // GTPT: also wishlistFactory should deal with this if
	        	WishlistFactory.addToWishlist($scope.theUser, $scope.wlName._id, {
	        		price: product.price,
	        		quantity: $scope.order.number,
	        		product: product._id
	        	}).then(function(wl){
	        		console.log(wl);
	        	})
	        }
            $scope.wlAdded = true;
            // GTPT: wut
	        $timeout(function () { $scope.wlAdded = false; }, 2000)

        }
        else{
        	$scope.notLoggedIn = true;
        }
    }

    $scope.newWishlist = function(wlName) {
    	console.log(wlName)
    	if (!wlName){
    		$scope.creating = true;
    	}
		else {
			$scope.creating = false;
		}
    }

    $scope.addProductReview = function(){
    	var currentuser = AuthService.getCurrentUser();
    	if(currentuser && currentuser._id){
        // GTPT: this feels a bit like a factory thing
	    	$uibModal.open({
	           animation: $scope.animationEnabled,
             // GTPT: double slash?
	           templateUrl: "/js/product//product.review.template.html",
	           controller: "ModalCtrl",
	           resolve: {
	           	  product: function(){
	           	  	  return theProduct
	           	  },
	           	  user : function(){
	           	  	return currentuser;
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
    // GTPT: wut
		$timeout(function () { $scope.added = false; }, 2000)
		if (!Session.currentOrder) {
			OrderFactory.create({items: [{price: $scope.product.price, product: $scope.product._id, quantity: $scope.order.number}]})
				.then(function(createdOrder) {
					Session.currentOrder = createdOrder;
				})
		}
		else {
      // GTPT: also here
			console.log('session order', Session.currentOrder)
			OrderFactory.addOrderItem(Session.currentOrder._id, {
				price: $scope.product.price, product: $scope.product._id, quantity: $scope.order.number
			})
			.then(function(order){
				// currentOrder = order;
				Session.currentOrder = order;
				console.log('SESSION ORDER FROM PREEXISTING', Session.currentOrder)
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
