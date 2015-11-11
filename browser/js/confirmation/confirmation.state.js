app.config(function($stateProvider) {
	$stateProvider.state('confirmation', {
		url: '/confirmation/:cId',
		templateUrl: '/js/confirmation/confirmation.template.html',
		controller: function($scope, $stateParams) {
			$scope.confirmNum = $stateParams.cId
		}
	})
});
