app.controller("CheckoutCtrl", function($scope, theOrder, currentUser, OrderFactory, $state){
  $scope.items = theOrder.items;
  var order = theOrder;

  if (currentUser){
    $scope.user = currentUser;
    $scope.userShipping = currentUser.addresses;
    $scope.userBilling = currentUser.billingDetails;
  }

  // var calcTotalPrice = function(){
  //     console.log(theOrder);
  //     var sum = theOrder.items.reduce(function(sum, item){
  //       return item.price * item.quantity;
  //     }, 0)
  //     return sum;
  // }

  $scope.totalPrice = OrderFactory.calculatePrice();

  $scope.useShippingAddress = function(address){
    $scope.billing.address = address;
  }

  $scope.submitAddress = function(){
    // GTPT: could you get here without being logged in?
      if($scope.user){
        UserFactory.addAddress($scope.user, $scope.address)
        .then(function(data){
          $scope.userShipping = data;
        })
      }
  }

  $scope.submitBilling = function(){
    if($scope.user){
      UserFactory.addBillingOption($scope.user, $scope.billing)
      .then(function(data){
        $scope.userBilling = data;
      })
    }
  }

  $scope.purchase = function(){
    
    console.log('click')
     OrderFactory.update(order._id, {status: "shipping"}).then(function(order){
      console.log(order);
      $state.go('home')
     })
  }

})
