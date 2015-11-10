app.controller('AdminProductsCtrl', function ($scope, ProductFactory, $uibModal){
   console.log($scope.product)

  $scope.productToEdit = function(product){
    $scope.toEdit = product;
  }

  $scope.editProduct = function(product){

        // GTPT: this feels a bit like a factory thing
    $uibModal.open({
      animation: $scope.animationEnabled,
      templateUrl: "/js/admin/admin.product.edit.template.html",
      controller: "AdminProductModalCtrl",
      resolve: {
        productToEdit: function(){
          return product;
        },
        categories: function(){
          return ProductFactory.getAllCategories();
        }
      }
    })
  }
})

