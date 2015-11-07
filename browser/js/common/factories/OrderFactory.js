app.factory('OrderFactory', function($http){
  function toData(res) {
    return res.data;
  }

  var baseURL = '/api/orders/'

  var theOrder;

  return {
      getAll: function(){
        return $http.get(baseURL).then(toData)
      },
      getOne: function(id){
        return $http.get(baseURL +id).then(toData).then(function(order) {
          console.log(order)
          theOrder = order;
          return theOrder;
        })
      },
      create: function(orderData){
        return $http.post(baseURL, orderData).then(toData).then(function(order) {
          theOrder = order;
          return theOrder;
        })
      },
      delete: function(id){
         return $http.delete(baseURL+id).then(toData)
      },
      update:function(id, orderData){
        return $http.put(baseURL+id, orderData).then(toData).then(function(order) {
          theOrder = order;
          return theOrder;
        })
      },
      addOrderItem: function(id, itemData){
        return $http.post(baseURL+id+'/items', itemData).then(toData).then(function(order) {
          theOrder = order;
          return theOrder;
        })
      },
      isCurrentOrder: function() {
        return theOrder;
      }
   }

}) 