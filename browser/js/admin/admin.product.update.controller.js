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
      $uibModalInstance.close()
    })

  }
  
  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel')
  }

})