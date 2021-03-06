
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
          return storedOrder;
        })
      },
      getOneFromWishlist: function(id){
        return $http.get(baseURL +id).then(toData)
      },
      create: function(orderData){
        return $http.post(baseURL, orderData).then(toData).then(function(order) {
          storedOrder = order;
          return storedOrder;
        })
      },

      createFromWishlist: function(orderData){
        return $http.post(baseURL, orderData).then(toData)
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

      updateStatus: function(id, statusObj){
        return $http.put(baseURL + id + "/status", statusObj)
        .then(toData)
        .then(function(data){
          storedOrder = data;
          return storedOrder
        })
      },

      orderCheckout: function(id, order){
        return $http.put(baseURL + id + "/checkout", order)
        .then(toData)
        .then(function(data){
          return data;
        })
      },

      addOrderItem: function(id, itemData){
        return $http.post(baseURL+id+'/items', itemData).then(toData).then(function(order) {
          storedOrder = order;
          return storedOrder;
        })
      },
      calculatePrice: function(){
        return storedOrder.items.reduce(function(sum, item){
          return sum + (item.price * item.quantity);
        },0)
      },
      getCurrentOrder: function(){
        return storedOrder;
      }
   }

})
