app.config(function($stateProvider) {
	$stateProvider.state('categories', {
		url: '/categories/:category',
		templateUrl: '/js/categories/categories.html',
		controller: 'CategoryCtrl',
		resolve: {
			categoryItems: function(ProductFactory, $stateParams) {
				return ProductFactory.getAllByCategory($stateParams.category)
			}
		}
	})
})

app.controller('CategoryCtrl', function($scope, $state, ProductFactory, categoryItems, AuthService, OrderFactory, $stateParams) {
	$scope.items = categoryItems[0].products.map(function(i){
		i.price = i.price/100; // GTPT: yayyy cents
		return i;
	})
	$scope.category = $stateParams.category;
	$scope.isLoggedIn = AuthService.isAuthenticated;
	$scope.goToProduct = function(product){
		$state.go('product', {id: product._id});
	};
	$scope.addToOrder = function(item) {
		var order = OrderFactory.isCurrentOrder() // GTPT: confusing name
		if (!order) {
			OrderFactory.create({items: [{price: item.price, product: item._id, quantity: 2}]})// GTPT: why 2?
				.then(function(createdOrder) {
					order = createdOrder
					console.log("NEW ORDER CREATED", order)
				})
		}
		else {
			console.log('!!!!!')
      // GTPT: maybe this function should do the find or create part
			OrderFactory.addOrderItem(order._id, {price: item.price, product: item._id, quantity: 2})
				.then(function(createdOrder) {
					order = createdOrder
					console.log("ADDING TO ORDER", order)
				})

		}
	}
})
