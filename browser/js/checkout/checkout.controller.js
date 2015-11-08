app.controller("CheckoutCtrl", function($scope, theOrder,UserFactory,AuthService){
  console.log("Inside the checkout controller:", theOrder);
  var order = theOrder;

  var totalPrice = function(){
    var sum  = 0;
    theOrder.items.forEach(function(){

    })
  }

  $scope.submitAddress = function(){
      console.log($scope.address)
      var user = AuthService.getCurrentUser();
      if(user && user._id){
        console.log("user in checkout", user)
      return UserFactory.addAddress(user, $scope.address)}
  }

})