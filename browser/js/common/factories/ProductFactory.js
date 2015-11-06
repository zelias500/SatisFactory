app.factory('ProductFactory', function($http){
    function toData(res) {
    return res.data;
  }

  var baseURL = '/api/products/'
   
  return {
    getAll: function(){
       return $http.get(baseURL).then(toData)
    },
    getOne: function(id){
      return $http.get(baseURL+ id).then(toData)
    },
    create: function(productData){
      return $http.post(baseURL, productData).then(toData)
    },
    updateOne: function(id, productData){
      return $http.put(baseURL+id, productData).then(toData)
    },
    deleteOne: function(id){
      return $http.delete(id).then(toData)
    },
    getAllbyCategory: function(category){
      return $http.get(baseURL+'/category/' + '?name='+category).then(toData)
    },
    getAllReviews: function(id){
        return $http.get(baseURL+ id +"/reviews").then(toData)
    }
  }


})