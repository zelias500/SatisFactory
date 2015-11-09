app.controller("CheckoutCtrl", function($scope, theOrder,UserFactory,AuthService){
  var order = theOrder;
  var user = AuthService.getCurrentUser();

  $scope.userShipping;

  $scope.userBilling;

  UserFactory.getAddresses(user)
  .then(function(addresses){
    $scope.userShipping = addresses;
  })

  UserFactory.getBillingOptions(user)
  .then(function(billing){
    $scope.userBilling = billing;
  })


  var totalPrice = function(){
    var sum  = 0;
    theOrder.items.forEach(function(){

    })
  }

  // Use shipping address as a billing address

  $scope.useShippingAddress = function(address){
    $scope.billing.name = address.name;
    $scope.billing.lineOne = address.lineOne;
    $scope.billing.lineTwo = address.lineTwo;
    $scope.billing.city = address.city;
    $scope.billing.zip = address.zip;
    $scope.billing.state = address.state;
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