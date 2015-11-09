app.config(function ($stateProvider) {
  $stateProvider.state('checkout', {
    url: "/checkout/:order",
    templateUrl: "/js/checkout/checkout.template.html",
    controller: "CheckoutCtrl",
    resolve: {
      theOrder: function($stateParams, OrderFactory){
        console.log("Resolved object:", $stateParams.order)
        return OrderFactory.getOne($stateParams.order);
      },
      currentUser: function(AuthService, UserFactory){
        if (!AuthService.getCurrentUser) return;
        try {
          var userToResolve;
          return AuthService.getCurrentUser().then(function(user){
            userToResolve = user;
            return UserFactory.getAddresses(userToResolve);
          }).then(function(addresses){
            userToResolve.addresses = addresses;
            return UserFactory.getBillingOptions(userToResolve);
          }).then(function(billingDetails){
            userToResolve.billingDetails = billingDetails;
            return userToResolve;
          })    
        }
        catch (e) {
          console.error('Not logged in!');
        }
        
      }
    }
  })
})
