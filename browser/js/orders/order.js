app.config(function($stateProvider){
	$stateProvider.state('order', {
		url:'/order',
		templateUrl: '/js/orders/order.html',
		controller: 'OrderCtrl',
		resolve: {
			theOrder: function(UserFactory, OrderFactory, AuthService, Session){
				if (Session.currentOrder) {
					return Session.currentOrder;
				}
			}
		}
	})
})

app.controller('OrderCtrl', function($scope, theOrder, OrderFactory, Session, $state) {
	$scope.order = theOrder;
	console.log($scope.order)
	$scope.empty = true
	
	$scope.removeFromOrder = function(item){
		var idx = $scope.order.items.indexOf(item);
		$scope.order.items.splice(idx, 1);
		$scope.total -= (item.quantity * item.price)
		return OrderFactory.update($scope.order._id, {index: idx}).then(function(order){
			console.log("UPDATED ORDER", order);
			Session.currentOrder = order;
		})
	}

	if ($scope.order.items) {
		$scope.total = $scope.order.items.reduce(function (prev, curr, idx, array){
			prev += (curr.quantity * curr.price)
			return prev;
		}, 0)
		$scope.empty = false;
	} else {
		$scope.empty = true;
	}

	$scope.deleteOrder = function() {
		return OrderFactory.delete($scope.order._id)
			.then(function() {
				delete Session.currentOrder;
				delete $scope.order;
				$scope.total = 0;
			})
	}


	$scope.goToCheckout = function(){
		if(theOrder.items.length){
			console.log("From the OrderCtrl: ", theOrder);
			$state.go('checkout', {order: theOrder._id});
		} 
	}

})