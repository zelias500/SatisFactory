app.factory('WishlistFactory', function($http) {
	function toData(res) {
		return res.data
	}

	var baseURL = '/api/users/'

	return {
		getWishlists: function(user){
			console.log("THIS IS OUR USER", user)
			return $http.get(baseURL+user._id+'/wishlist/').then(toData)
		},

		getWishlist: function(user, wishlistId){
			return $http.get(baseURL+user._id+'/wishlist/'+ wishlistId).then(toData)
		},

		createWishlist: function(user, data){
			return $http.post(baseURL+user._id+'/wishlist', data).then(toData)
		},

		addToWishlist: function(user, wishlistId, data){
			return $http.post(baseURL+user._id+'/wishlist/'+wishlistId, data).then(toData);
		},

		updateWishlist: function(user, wishlistId, data){
			return $http.put(baseURL+user._id+'/wishlist/'+wishlistId, data).then(toData)
		},

		deleteWishlist: function(user){
			return $http.delete(baseURL+user._id+'/wishlist').then(toData)
		}
	}
})