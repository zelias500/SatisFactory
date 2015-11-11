app.config(function ($stateProvider){
  $stateProvider.state('product', {
    url: '/products/:id',
    templateUrl: '/js/product/product.template.html',
    controller: 'ProductCtrl',
    resolve: {
      theProduct: function(ProductFactory, $stateParams){
        return ProductFactory.getOne($stateParams.id);
      },
      theUser: function(AuthService){
        return AuthService.getLoggedInUser();
      }
    }
  })
})
