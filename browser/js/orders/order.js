app.config(function($stateProvider){
	$stateProvider.state('order', {
		url:'/order',
		templateUrl: '/js/orders/order.html',
		controller: 'OrderCtrl',
		resolve: {
			theOrder: function(UserFactory, OrderFactory, AuthService){
				if (AuthService.isAuthenticated()) {
					UserFactory.getUserOrders(AuthService.getCurrentUser())
						.then(function(orders) {
							return orders.filter(function(i) {
								return i.status === 'pending'
							})[0]
						})
						.then(function(order) {
							return OrderFactory.getOne(order._id)
						})

				}
				else {
					// if (!!OrderFactory.isCurrentOrder()) {
						return OrderFactory.isCurrentOrder()
					// }
				}
			}
		}
	})
})

app.controller('OrderCtrl', function($scope, theOrder, OrderFactory) {
	// $scope.order = theOrder;
	$scope.order = OrderFactory.isCurrentOrder();
})