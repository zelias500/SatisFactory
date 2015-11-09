app.controller("CheckoutCtrl", function($scope, theOrder, UserFactory, AuthService){
  var order = theOrder;
  var user = AuthService.getCurrentUser()
  .then(function(user){
    return user;
  })
  .then(function(user){
    UserFactory.getAddresses(user)
    .then(function(addresses){
      $scope.userShipping = addresses;
    })
    return user;
  })
  .then(function(user){
    UserFactory.getBillingOptions(user)
    .then(function(billingDetails){
      $scope.userBilling = billingDetails;
    })
  })

  var calcTotalPrice = function(){
      console.log(theOrder);
      var sum = theOrder.items.reduce(function(sum, item){
        return item.price * item.quantity;
      }, 0)
      return sum;
  }

  $scope.totalPrice = calcTotalPrice();


  // Use shipping address as a billing address

  $scope.useShippingAddress = function(address){
    $scope.billing.address = address;
  }

  $scope.submitAddress = function(){
      if(user && user._id){
        // console.log("user in checkout", user)
        UserFactory.addAddress(user, $scope.address)
        .then(function(data){
          $scope.userShipping = data;
        })
      }
  }

  $scope.submitBilling = function(){
    if(user && user._id){
      UserFactory.addBillingOption(user, $scope.billing)
      .then(function(data){
        $scope.userBilling = data;
      })
    }
  }

})