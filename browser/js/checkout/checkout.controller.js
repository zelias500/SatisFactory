app.controller("CheckoutCtrl", function($scope, theOrder, currentUser, OrderFactory, $state){
  $scope.items = theOrder.items;
  var order = theOrder;

  if (currentUser){
    $scope.user = currentUser;
    $scope.userShippingAddresses = currentUser.addresses;
    $scope.userBillingDetails = currentUser.billingDetails;
  }

  $scope.billingOption = $scope.userBillingDetails[0];

  $scope.orderAddress = $scope.userShippingAddresses[0];

  $scope.totalPrice = OrderFactory.calculatePrice();

  $scope.useAsShippingAddress = function(address){
    $scope.userShipping = address;
  }

  $scope.submitAddress = function(){
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
     OrderFactory.orderCheckout(order._id, {
      shipTo: $scope.orderAddress,
      billWith: $scope.billingOption,
      status: "shipping"})
     .then(function(order){
      console.log(order);
      $state.go('confirmation')
     })
  }

})
