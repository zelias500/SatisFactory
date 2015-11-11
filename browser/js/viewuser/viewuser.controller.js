app.controller("ViewUserCtrl", function ($scope, user, orders, products, $state){

  user.orders = user.orders.map(function(order){
     var mappedOrder = _.uniq(orders, {_id: order})[0];
     if(mappedOrder){
      mappedOrder.orderDate = Date(mappedOrder.orderDate);
      mappedOrder.subtotal = mappedOrder.items.reduce(function(sum, item){
        return sum + (item.price * item.quantity);
      }, 0)

      mappedOrder.items = mappedOrder.items.map(function(item){
        console.log(_.uniq(products, {_id: item._id}));
        item.product = _.uniq(products, {_id: item._id})[0];
        return item;
      })
      return mappedOrder;
     } else {
      return "Discarded Cart";
     }
  })

  $scope.user = user;

  $scope.orders = orders;

  $scope.goToProduct = function(item){
    $state.go('product', { id: item._id })
  };

  console.log("USER:", user);
  console.log("ORDERS:", orders);

})