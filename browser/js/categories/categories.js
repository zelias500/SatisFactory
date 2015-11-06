app.config(function($stateProvider) {
	$stateProvider.state('categories', {
		url: '/:category',
		templateUrl: '/js/categories/categories.html',
		controller: 'CategoryCtrl',
		resolve: {
			categoryItems: function(ProductFactory, $stateParams) {

				return ProductFactory.getAllByCategory($stateParams.category)
			},
			category: function($stateParams) {
				return $stateParams.category
			}
		}
	})
})

app.controller('CategoryCtrl', function($scope, $state, ProductFactory, categoryItems, category) {
	$scope.items = categoryItems[0].products;
	$scope.category = category;

})
