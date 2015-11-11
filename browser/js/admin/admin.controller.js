app.controller('AdminCtrl', function($rootScope, $scope, products, orders, users, UserFactory, ProductFactory){
   $scope.users = users;
   $scope.orders = orders;
   $scope.products = products;
   $rootScope.updateproduct = {};

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
})