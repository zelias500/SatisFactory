app.directive("search", function($state, ProductFactory){
  return {
    restrict: 'E',
    templateUrl: "/js/common/directives/search/search.template.html",
    link: function(scope) {
    	ProductFactory.getAll()
    		.then(function(products) {
    			scope.products = products;
    		}),
    scope.seeProduct = function(product){
		$state.go('product', {id: product._id});
	};
  }
}
})