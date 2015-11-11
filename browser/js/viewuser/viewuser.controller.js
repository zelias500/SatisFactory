app.controller("ViewUserCtrl", function ($scope, user, orders){

  $scope.user = user;

  $scope.orders = orders;

  console.log("USER:", user);
  console.log("ORDERS:", orders);

})