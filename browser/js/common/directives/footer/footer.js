app.directive('footer', function(ProductFactory, $state) {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/footer/footer.html',
		link: function(scope) {
			scope.categories;
			ProductFactory.getAllCategories().then(function(categories){
				scope.categories = categories;
			})
			scope.goToCategory = function(category) {
				$state.go('categories', {
					category: category
				})
			}
			scope.isActive = function(category) {
				return category === scope.category
			}	
		}
	}
})