app.controller("AdminOrdersCtrl", function($scope, OrderFactory){

  $scope.setStatus = function(order, data){
    OrderFactory.updateStatus(order._id, { status: data })
    .then(function(updated){
      order.status = updated.status;
    })
  }

})