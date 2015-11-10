app.config(function ($stateProvider){
  $stateProvider.state("user", {
    url: "/:id",
    templateUrl: "/js/user/user.template.html",
    controller: "UserCtrl"
  })
})