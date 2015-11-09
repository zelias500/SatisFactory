
app.factory('OrderFactory', function($http, $cookies){
  function toData(res) {
    return res.data;
  }

  var baseURL = '/api/orders/'

  var storedOrder; 


  return {
      getAll: function(){
        return $http.get(baseURL).then(toData)
      },
      getOne: function(id){
        return $http.get(baseURL +id).then(toData).then(function(order) {
          if (!storedOrder) storedOrder = order;
          console.log(storedOrder);
          return storedOrder;
        })
      },
      create: function(orderData){
        return $http.post(baseURL, orderData).then(toData).then(function(order) {
          storedOrder = order;
          return storedOrder;
        })
      },
      delete: function(id){
         return $http.delete(baseURL+id).then(toData).then(function(){
          $cookies.remove('order');
         })
      },
      update:function(id, orderData){
        return $http.put(baseURL+id, orderData).then(toData).then(function(order) {
          storedOrder = order;
          return storedOrder;
        })
      },
      addOrderItem: function(id, itemData){
        return $http.post(baseURL+id+'/items', itemData).then(toData).then(function(order) {
          console.log("THIS IS THE ORDER", order)
          storedOrder = order;
          return storedOrder;
        })
      },
      calculatePrice: function(){
        return storedOrder.items.reduce(function(sum, item){
          return item.price * item.quantity;
        },0)
      },
      getCurrentOrder: function(){
        return storedOrder;
      }
   }

})
