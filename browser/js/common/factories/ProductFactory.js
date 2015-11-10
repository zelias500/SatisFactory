app.factory('ProductFactory', function($http){
    function toData(res) {
    return res.data;
  }

  var baseURL = '/api/products/'

  return {
    getAll: function(){
       return $http.get(baseURL).then(function(res){
          return res.data
       }).then(function(products){
           var getproducts = products.map(function(ele){
               ele.category = ele.category.name
               return ele
           })
           return getproducts
       })
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
    getAllCategories: function() {
      return $http.get(baseURL+'category').then(toData)
    },
    getAllByCategory: function(category){
      return $http.get(baseURL+'category/' + '?name='+category).then(toData)
    },
    getAllReviews: function(id){
        return $http.get(baseURL+ id +"/reviews").then(toData)
    },
    createReview: function(data){
      return $http.post('/api/reviews', data).then(toData)
    }

  }


})