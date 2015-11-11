app.config(function ($stateProvider){
  $stateProvider.state('viewuser', {
    url: '/users/:id',
    templateUrl: '/js/viewuser/viewuser.template.html',
    controller: 'ViewUserCtrl',
    resolve: {
      user: function(AuthService){
        return AuthService.getLoggedInUser();
      },
      orders: function(OrderFactory) {
        return OrderFactory.getAll();
      },
      products: function(ProductFactory) {
        return ProductFactory.getAll();
      }
    }
  })
})