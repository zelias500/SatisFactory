app.controller('AdminCtrl', function($scope, products, orders, users, UserFactory, ProductFactory){
   $scope.users = users;
   $scope.orders = orders;
   $scope.products = products;

   $scope.toAdmin = function(id, isadmin){
      UserFactory.changeUserSetting(id,{isAdmin: !isadmin}).then(function(user){
      	var userindex = _.findIndex($scope.users,{"_id": user._id})
      	_.extend($scope.users[userindex], user)
      })
   }

   $scope.removeUser = function(user){
   	var userindex = _.findIndex($scope.users,{"_id": user._id})
   	UserFactory.delete(user).then(function(user){
       _.pullAt($scope.users, userindex)
   	})
   }


   console.log($scope.status);

   $scope.orderStatus = [{ name: "pending"}, {name: "shipping"}, {name:"completed"}, {name: "cancelled"}];

   // $scope.editProduct = function(product){

			// console.log($scope.product)
   //    ProductFactory.updateOne(product._id, $scope.product).then(function(updateProduct){
   //    	  console.log(updateProduct)
   //    })
   // }

})

app.controller('AdminProductCtrl', function($scope,ProductFactory){
   console.log($scope.product)
   $scope.editProduct = function(product){

			console.log($scope.product)
      ProductFactory.updateOne(product._id, $scope.product).then(function(updateProduct){
      	  console.log(updateProduct)
      })
   }

})