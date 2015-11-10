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



app.controller("AdminProductModalCtrl", function ($scope, $rootScope, $uibModalInstance, ProductFactory, productToEdit){

  $scope.productToUpdate = productToEdit;

  $scope.ok = function(){

    ProductFactory.updateOne($scope.productToUpdate._id,
    {
      title: $scope.productToUpdate.title,
      price: $scope.productToUpdate.price,
      description: $scope.productToUpdate.description,
      photo: $scope.productToUpdate.photo,
      quantity: $scope.productToUpdate.quantity,

    })
    .then(function(data){
      // GTPT: maybe a socket might be better?
      // GTPT: or product.reviews.push or something
      console.log(data);
      $uibModalInstance.close()
    })

  }
  
  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel')
  }

})