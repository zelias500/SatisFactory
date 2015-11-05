app.factory('UserFactory', function($http){
	function toData(res) {
		return res.data;
	}

	var baseURL = '/api/users/'

	function getAUser(user) {
		return $http.get(baseURL+user._id)
	}

	return {
		getOne: function(user){
			return getAUser(user).then(function(res){
				return toData(res);
			});
		},

		getAll: function() {
			return $http.get(baseURL).then(function(res){
				return toData(res);
			})
		},

		create: function(userData){
			return $http.post(baseURL, userData).then(function(res){
				return toData(res);
			})
		},

		delete: function(user){
			return $http.delete(baseURL+user._id).then(function(res){
				return toData(res);
			})
		},

		getOneByEmail: function(email){
			return $http.get(baseURL+'email?email='+email).then(function(res){
				return toData(res);
			})
		},

		getUserOrders: function(user){
			return $http.get(baseURL+user._id+'/orders').then(function(res){
				return toData(res)
			})
		},

		getUserReviews: function(user){
			return $http.get(baseURL+user._id+'/reviews').then(function(res){
				return toData(res)
			})
		},

		getWishlist: function(user){
			return $http.get(baseURL+user._id+'/wishlist').then(function(res){
				return toData(res)
			})
		},

		addToWishlist: function(user, data){
			return $http.post(baseURL+user._id+'/wishlist', data).then(function(res){
				return toData(res)
			})
		},

		updateWishlist: function(user, data){
			return $http.put(baseURL+user._id+'/wishlist', data).then(function(res){
				return toData(res)
			})
		},

		deleteWishlist: function(user){
			return $http.delete(baseURL+user._id+'/wishlist').then(function(res){
				return toData(res)
			})
		},

		getAddresses: function(user) {
			return getAUser(user).then(function(res){
				return toData(res);
			}).then(function(user){
				return user.shipping;
			})
		},

		addAddress: function(user, data) {
			return $http.post(baseURL+user._id+'/shipping', data).then(function(res){
				return toData(res);
			})
		},

		deleteAddress: function(user, data) {
			return $http.put(baseURL+user._id+'/shipping', data).then(function(res){
				return toData(res);
			})
		},

		changeUserSetting: function(user, data){
			return $http.put(baseURL+user._id, data).then(function(res){
				return toData(res);
			})
		},

		getBillingOptions: function(user) {
			return getAUser(user).then(function(res){
				return toData(res);
			}).then(function(user){
				return user.billing;
			})
		},
		addBillingOption: function(user, data) {
			return $http.post(baseURL+user._id+'/billing', data).then(function(res){
				return toData(res);
			})
		},

		deleteBillingOption: function(user, data) {
			return $http.put(baseURL+user._id+'/billing', data).then(function(res){
				return toData(res);
			})
		}
	}
})