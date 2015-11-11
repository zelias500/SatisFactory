app.config(function($stateProvider) {
	$stateProvider.state('confirmation', {
		url: '/confirmation/:cId',
		templateUrl: '/js/confirmation/confirmation.template.html',
	})
});
