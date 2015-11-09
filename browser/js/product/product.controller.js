
app.controller('ProductCtrl', function ($scope, Session, theProduct, UserFactory, AuthService,$uibModal, OrderFactory, $timeout){

   var product = theProduct;
   $scope.product = product;

   $scope.wlAdded, $scope.notLoggedIn, $scope.added,$scope.creating = true;


   // $scope.theUser = AuthService.getCurrentUser();

   AuthService.getCurrentUser().then(function(user){
   	$scope.theUser = user;
   })



   $scope.addWishList = function(){
        if ($scope.theUser && $scope.theUser._id){
        	console.log($scope.creating)
	        if ($scope.creating){
	        	console.log("THIS IS OUR USER", $scope.theUser)
	        	UserFactory.createWishlist($scope.theUser, {
	        		items: {price: product.price, product: product._id, quantity: $scope.order.number},
	        		wlName: $scope.newWishlistName
	        	}).then(function(wl){
	        		console.log(wl);
	        	})
	        }
	        else {
	        	UserFactory.addToWishlist($scope.theUser, $scope.wlName._id, {
	        		price: product.price,
	        		quantity: $scope.order.number,
	        		product: product._id
	        	}).then(function(wl){
	        		console.log(wl);
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
    	console.log(wlName)
    	if (!wlName){
    		$scope.creating = true;
    	}
		else {
			$scope.creating = false;
		}
    }

    $scope.addProductReview = function(){
    	var user = AuthService.getCurrentUser();
    	if(user && user.id){
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
	    }else{
    		console.log("Please sign in");
        	return "Please sign up or login to create a review.";
    	}
    };


	$scope.product.price = $scope.product.price / 100;


	$scope.addToOrder = function() {
		// var currentOrder = OrderFactory.isCurrentOrder()
		$scope.added = true;
		$timeout(function () { $scope.added = false; }, 2000)
		if (!Session.currentOrder) {
			OrderFactory.create({items: [{price: $scope.product.price, product: $scope.product._id, quantity: $scope.order.number}]})
				.then(function(createdOrder) {
					// currentOrder = createdOrder
					Session.currentOrder = createdOrder
					// console.log("NEW ORDER CREATED", createdOrder);
					// console.log('SESSION ORDER TEST', Session.currentOrder)
					// console.log('FROM ORDER FACTORY:', OrderFactory.isCurrentOrder())
				})
		}
		else {
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

		// else {
		// 	console.log('!!!!!')
		// 	OrderFactory.addOrderItem(order._id, {price: item.price, product: item._id, quantity: 2})
		// 		.then(function(createdOrder) {
		// 			console.log(createdOrder)
		// 			order = createdOrder
		// 			console.log("ADDING TO ORDER", order)
		// 		})

		// }
	}
})


app.controller('ModalCtrl', function($scope,$uibModalInstance, ProductFactory, product){

	$scope.ok = function(){
        ProductFactory.createReview({product:product._id, content: $scope.review.content, numStars:$scope.review.stars })
		$uibModalInstance.close()
	}
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel')
	}


})
