app.factory('OrderFactory', function($http, Session){
  function toData(res) {
    return res.data;
  }

  var baseURL = '/api/orders/'

  var theOrder; // GTPT: this is a weird name, which order is it?

  return {
      getAll: function(){
        return $http.get(baseURL).then(toData)
      },
      getOne: function(id){
        return $http.get(baseURL +id).then(toData).then(function(order) {
          // console.log(order)
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
          return order;
          // GTPT: why not cache here? or maybe _.merge orderData into theOrder
        //   theOrder = order;
        //   return theOrder;
        })
      },
      addOrderItem: function(id, itemData){
        return $http.post(baseURL+id+'/items', itemData).then(toData).then(function(order) {
          console.log("THIS IS THE ORDER", order)
          theOrder = order;
          return theOrder;
        })
      },
      // GTPT: also weird name
      isCurrentOrder: function() {
        return theOrder;
      }
   }

})
