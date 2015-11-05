app.factory('OrderFactory', function($http){
    function toData(res) {
    return res.data;
  }

  var baseURL = '/api/orders/'

  return {
      getAll: function(){
        return $http.get(baseURL).then(toData)
      },
      getOne: function(id){
        return $http.get(baseURL +id).then(toData)
      },
      create: function(orderData){
        return $http.post(baseURL, orderData).then(toData)
      },
      delete: function(id){
         return $http.delete(baseURL+id).then(toData)
      },
      update:function(id, orderData){
        return $http.put(baseURL+id, orderData).then(toData)
      },
      addOrderItem: function(id, itemData){
        return $http.post(baseURL+id, itemData).then(toData)
      }
   }

}) 