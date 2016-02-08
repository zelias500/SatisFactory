app.controller("CheckoutCtrl", function($scope, theOrder, currentUser, OrderFactory, $state, UserFactory){


  $scope.items = theOrder.items;
  var order = theOrder;

  if (currentUser){
    $scope.user = currentUser;
    $scope.userShippingAddresses = currentUser.addresses;
    $scope.userBillingDetails = currentUser.billingDetails;
  }
  else{
    $scope.userShippingAddresses = {};
    $scope.userBillingDetails= {};
  }

  $scope.billingOption = $scope.userBillingDetails[0] || {};

  if($scope.userShippingAddresses){
    $scope.orderAddress = $scope.userShippingAddresses[0]
  }
  else{
    $scope.orderAddress = {}
  }

  $scope.totalPrice = OrderFactory.calculatePrice();
  $scope.billing = {};

  $scope.useAsShippingAddress = function(address){
    $scope.userShipping = address;
    $scope.orderAddress = address;
    $scope.billing.address  = address;
  }

  $scope.useShipping = function(){
    console.log($scope.billing.address)
    $scope.billing.address = $scope.address
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

  $scope.submitPayment = function(){
    $scope.billingOption.address = $scope.billing.address;
    $scope.billingOption = $scope.billing;
  }

  $scope.purchase = function(){
     OrderFactory.orderCheckout(order._id, {
      shipTo: $scope.orderAddress,
      billWith: $scope.billingOption,
      status: "shipping"})
     .then(function(order){
        $state.go('confirmation', {cId: order._id})
     })
  }
  $scope.showme = false;
  $scope.showform = function(){
     $scope.showme = ! $scope.showme
  }

})
