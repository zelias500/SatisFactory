app.config(function($stateProvider){
	$stateProvider.state('order', {
		url:'/order',
		templateUrl: '/js/orders/order.html',
		controller: 'OrderCtrl',
		resolve: {
			theOrder: function(UserFactory, OrderFactory, AuthService, $cookies){
				if ($cookies.get('order')) {
					return OrderFactory.getOne($cookies.get('order'));
				}
				else {
					return {error: 'nothing here!'}
				}
			}
		}
	})
})

app.controller('OrderCtrl', function($scope, theOrder, OrderFactory, Session, $state, $cookies) {
	$scope.order = theOrder;
	$scope.empty = true

	$scope.removeFromOrder = function(item){
		var idx = _.findIndex(OrderFactory.getCurrentOrder().items, function(i){
			return i._id == item._id;
		})
		$scope.order.items.splice(idx, 1)
		return OrderFactory.update(OrderFactory.getCurrentOrder()._id, {index: idx}).then(function(order){
			console.log('UPDATED', order)
			$scope.total = OrderFactory.calculatePrice();
		})
	}

	if ($scope.order.items) {
		$scope.total = OrderFactory.calculatePrice();
		$scope.empty = false;
	} else {
		$scope.empty = true;
	}


	$scope.deleteOrder = function() {
		return OrderFactory.delete($scope.order._id).then(function(){
			$state.go('home')
		});
	}

	$scope.goToCheckout = function(){
		if($scope.order.items.length){
			console.log("From the OrderCtrl: ", $scope.order);
			$state.go('checkout', {order: $scope.order._id});
		} 
	}

})
