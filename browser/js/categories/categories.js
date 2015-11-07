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

app.controller('CategoryCtrl', function($scope, $state, ProductFactory, categoryItems, category, AuthService) {
	$scope.items = categoryItems[0].products.map(function(i){
		i.price = i.price/100;
		return i;
	})
	$scope.category = category;
	$scope.isLoggedIn = AuthService.isAuthenticated;
	$scope.goToProduct = function(product){
		$state.go('product', {id: product._id});
	};
	$scope.addToCart = function(product, quantity){

	}
})
