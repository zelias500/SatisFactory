app.config(function($stateProvider){
  $stateProvider.state('admin',{
  	url:'/admin',
  	templateUrl: "/js/admin/admin.template.html",
  	controller: "AdminCtrl",
  	resolve:{
  		products: function(ProductFactory){
  			return ProductFactory.getAll()
  		},
  		orders: function(OrderFactory){
  			return OrderFactory.getAll()
  		},
  		users: function(UserFactory){
  			return UserFactory.getAll()
  		}
  	}
  })
  .state('admin.users',{
  	url:'/users',
  	templateUrl:'/js/admin/admin.users.template.html'
  })
  .state('admin.products',{
  	url:'/products',
  	templateUrl:'/js/admin/admin.products.template.html',
    controller: 'AdminProductsCtrl'
  })
  .state('admin.orders',{
  	url:'/orders',
  	templateUrl:'/js/admin/admin.orders.template.html',
    controller: 'AdminOrdersCtrl'
  })

})