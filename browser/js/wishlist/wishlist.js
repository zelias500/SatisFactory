app.config(function($stateProvider){
	$stateProvider.state('wishlist', {
		url:'/wishlist/:userId/:wishlistId',
		templateUrl: '/js/wishlist/wishlist.html',
		controller: 'WishlistCtrl',
		resolve: {
			wishlistPerson: function($stateParams, UserFactory) {
				return UserFactory.getOne({_id: $stateParams.userId})
					.then(function(user) {
						return user
					})
			},
			theWishlist: function($stateParams, WishlistFactory) {
				return WishlistFactory.getWishlist($stateParams.userId, $stateParams.wishlistId).then(function(wishlist){
					return wishlist;
				})
			}
		}
	}),

	$stateProvider.state('wishlists', {
		url: '/wishlist',
		templateUrl: '/js/wishlist/wishlists.html',
		controller: 'WishlistsCtrl',
		resolve: {
			ourWishlists: function(AuthService){
				return AuthService.getCurrentUser().then(function(user){
					return user.wishlist;
				})
			},
			ourUser: function(AuthService){
				return AuthService.getCurrentUser();
			}
		}
	}),

	$stateProvider.state('adminWishlistsView', {
		url:'/wishlist/user/:userid',
		templateUrl: '/js/wishlist/wishlists.html',
		controller: 'AdminWishlistCtrl',
		resolve: {
			wishlistList: function(UserFactory, $stateParams){
       				// admin version of wishlist controller goes here

			}
		}
	})
})

app.controller('WishlistCtrl', function($scope, UserFactory, wishlistPerson, theWishlist, $location, OrderFactory, $state) {
	$scope.theLink = $location.absUrl();
	$scope.wishlister = wishlistPerson;
	// console.log($scope.wishlister)
	$scope.wishlist = theWishlist
	console.log($scope.wishlist)
	$scope.buyWishlistItem = function(item){
		// OrderFactory.create(item)
		// console.log(item);
		OrderFactory.create({items: {price: item.price, quantity: item.quantity, product: item.product._id}}).then(function(order){
			console.log(order);
			$state.go('checkout', {order: order._id})		
		})
	}
})


app.controller('WishlistsCtrl', function($scope, ourWishlists, AuthService, $state, ourUser){
	$scope.wishlists = ourWishlists;
	// AuthService.getCurrentUser().then(function(user){
	// 	$scope.theUser = user;
	// })
	$scope.theUser = ourUser;
	console.log($scope.theUser._id);

	$scope.goToWishlist = function(wishlistId){
		$state.go('wishlist', {userId: $scope.theUser._id, wishlistId: wishlistId})
	}

	$scope.user = AuthService.getCurrentUser;
	// $scope.wishlists = UserFactory.getWishlists($scope.user)
})

