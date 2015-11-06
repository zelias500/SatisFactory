app.config(function ($stateProvider){
  $stateProvider.state('product', {
    url: '/products/:id',
    templateUrl: 'product.template.html',
    controller: 'ProductCtrl',
    resolve: {
      theProduct: function(ProductFactory, $stateParams){
        return ProductFactory.getOne($stateParams.id);
      }
    }
  })
})

