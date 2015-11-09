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
				else {
          // GTPT: why not find it? or isn't there one?
					return {error: 'nothing here!'}
				}
			}
		}
	})
})

app.controller('OrderCtrl', function($scope, theOrder, OrderFactory, Session, $state) {
	$scope.order = theOrder;
	console.log($scope.order)

	$scope.removeFromOrder = function(item){
		var idx = $scope.order.items.indexOf(item);
		$scope.order.items.splice(idx, 1);
    // GTPT: this might get annoying
		$scope.total -= (item.quantity * item.price)
		return OrderFactory.update($scope.order._id, {index: idx}).then(function(order){
			console.log("UPDATED ORDER", order);
			Session.currentOrder = order;
		})
	}

	if ($scope.order.items) {
    // GTPT: could somone change the price with angular wizardry?
    // GTPT: yay reduce!
		$scope.total = $scope.order.items.reduce(function (prev, curr, idx, array){
		prev += (curr.quantity * curr.price)
		return prev;
	}, 0)

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
		console.log("From the OrderCtrl: ", theOrder);
		$state.go('checkout', {order: theOrder._id});
	}

})
