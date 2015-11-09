app.config(function ($stateProvider) {
  $stateProvider.state('checkout', {
    url: "/checkout/:order",
    templateUrl: "/js/checkout/checkout.template.html",
    controller: "CheckoutCtrl",
    resolve: {
      // GTPT: why theOrder? why not just order?
      theOrder: function($stateParams, OrderFactory){
        console.log("Resolved object:", $stateParams.order)
        return OrderFactory.getOne($stateParams.order);
      }
    }
  })
})
