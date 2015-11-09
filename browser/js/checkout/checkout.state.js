app.config(function ($stateProvider) {
  $stateProvider.state('checkout', {
    url: "/checkout/:order",
    templateUrl: "/js/checkout/checkout.template.html",
    controller: "CheckoutCtrl",
    resolve: {
      theOrder: function($stateParams, OrderFactory){
        if (OrderFactory.getCurrentOrder()._id == $stateParams._id){
          return OrderFactory.getOne($stateParams.order); 
        }
        else {
          try {    
                return OrderFactory.getOneFromWishlist($stateParams.order);
              }
          catch(e) {
            console.error(e)
          }
        }
        // check if current order id is the same as the cached order
        // if it is , whatever
        // if it's not, call get from wishlist
        // console.log("Resolved object:", $stateParams.order)       
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
