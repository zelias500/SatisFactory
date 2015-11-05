app.config(function ($stateProvider){
  $stateProvider.state('product', {
    url: '/products/:productId',
    templateUrl: 'product.template.html',
    controller: 'ProductCtrl'
    resovle: {
      theProduct: function(ProductFactory, $stateParams){
        return ProductFactory.getOne($stateParams.productId);
      }
    }
  })
})

