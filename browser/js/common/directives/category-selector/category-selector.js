app.directive("categorySelector", function(ProductFactory, $state){
  return {
    restrict: 'E',
    templateUrl: "/js/common/directives/category-selector/category-selector.template.html",
    link: function(scope){
      scope.categories; // GTPT: scope.categories... what?
      ProductFactory.getAllCategories().then(function(categories){
        scope.categories = categories;
      })
      scope.goToCategory = function(category){
        $state.go('categories', { category: category });
      };
      scope.isActive = function(category){
        return category === scope.category;
      }
    }
  }
})
