app.config(function($stateProvider){
	$stateProvider.state('wishlist', {
		url:'/wishlist/:id/:wishlistId',
		templateUrl: '/js/wishlist/wishlist.html',
		controller: 'WishlistCtrl',
		resolve: {
			wishlistPerson: function($stateParams, UserFactory) {
				return UserFactory.getOne({_id: $stateParams.id})
					.then(function(user) {
						return user
					})
			},
			theWishlist: function($stateParams, UserFactory) {
				return UserFactory.getWishlist({_id: $stateParams.id}, $stateParams.wishlistId)
					.then(function(wishlist) {
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
			wishlistList: function(UserFactory, AuthService){
				return UserFactory.getWishlists(AuthService.getCurrentUser())
					.then(function(theWishlists) {
						console.log('BEFORE POPULATING', theWishlists)
						theWishlists.populate('wishlist').execPopulate()
					})
					.then(function(wishlistInfo) {
						console.log('AFTER', wishlistInfo)
						return wishlistInfo
					})
			}
		}
	}),

	$stateProvider.state('adminWishlistsView', {
		url:'/wishlist/user/:userid',
		templateUrl: '/js/wishlist/wishlists.html',
		controller: 'AdminWishlistCtrl',
		resolve: {
			wishlistList: function(UserFactory, $stateParams){
				// UserFactory.getWishlists($stateParams.userid)
				// 	.then(function(theWishlists) {
				// 		console.log('BEFORE POPULATING', theWishlists)
				// 		theWishlists.populate('wishlist').execPopulate()
				// 	})
				// 	.then(function(wishlistInfo) {
				// 		console.log('AFTER', wishlistInfo)
				// 		return wishlistInfo
				// 	})
				
			}
		}
	})
})

app.controller('WishlistCtrl', function($scope, UserFactory, wishlistPerson) {
	$scope.wishlister = wishlistPerson;
	console.log($scope.wishlister)
})


app.controller('WishlistsCtrl', function($scope, wishlistList, AuthService, UserFactory){
	$scope.wishlists = wishlistList;

	$scope.user = AuthService.getCurrentUser;
	// $scope.wishlists = UserFactory.getWishlists($scope.user)
})