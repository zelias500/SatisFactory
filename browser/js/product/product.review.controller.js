app.controller('ModalCtrl', function ($scope, $rootScope, $uibModalInstance, ProductFactory, product, user){

  $scope.max = 5;

  $scope.ratingStates = [{
    stateOn: 'glyphicon-star',
    stateOff: 'glyphicon-star-empty'
  }];

  $scope.ok = function(){
    ProductFactory.createReview({product:product._id, user: user._id, content: $scope.review.content, numStars:$scope.review.stars })
    .then(function(data){
      // SU: GTPT Suggested using sockets or something else, have decided to keep this in for now.
      $rootScope.$broadcast('reviewAdded', data);
      $uibModalInstance.close()
    })

  }
  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel')
  }




})