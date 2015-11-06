app.directive('footer', function(ProductFactory) {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/footer/footer.html',
		link: function(scope) {
			scope.categories = ProductFactory.getAllCategories();
			scope.goToCategory = function(category) {
				$state.go('Category', {
					category: category
				})
			}
			scope.isActive = function(category) {
				return category === scope.category
			}	
		}
	}
})