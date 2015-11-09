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
			return getAUser(user).then(toData);
		},

		getAll: function() {
			return $http.get(baseURL).then(toData);
		},

		create: function(userData){
			return $http.post(baseURL, userData).then(toData);
		},

		delete: function(user){
			return $http.delete(baseURL+user._id).then(toData);
		},

		getOneByEmail: function(email){
			return $http.get(baseURL+'email?email='+email).then(toData);
		},

		getUserOrders: function(user){
			return $http.get(baseURL+user._id+'/orders').then(toData)
		},

		getUserReviews: function(user){
			return $http.get(baseURL+user._id+'/reviews').then(toData)
		},

		getAddresses: function(user) {
			return $http.get(baseURL + user._id + "/shipping").then(toData);
		},

		addAddress: function(user, data) {
			return $http.post(baseURL+user._id+'/shipping', data).then(toData);
		},

		deleteAddress: function(user, data) {
			return $http.put(baseURL+user._id+'/shipping', data).then(toData);
		},

		changeUserSetting: function(user, data){
			return $http.put(baseURL+user._id, data).then(toData);
		},

		getBillingOptions: function(user) {
			return $http.get(baseURL + user._id + "/billing").then(toData);
		},
		addBillingOption: function(user, data) {
			return $http.post(baseURL+user._id+'/billing', data).then(toData);
		},

		deleteBillingOption: function(user, data) {
			return $http.put(baseURL+user._id+'/billing', data).then(toData);
		}
	}
});
