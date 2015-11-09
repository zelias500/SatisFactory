app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, UserFactory, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {
        console.log(loginInfo);

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('home');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

    $scope.localSignup = function(signupInfo) {
        // signupinfo {name: name, email: email, password: password}
        UserFactory.create(signupInfo).then(function(user){
            return AuthService.login({email: signupInfo.email, password:signupInfo.password})
        }).then(function(){
            $state.go('home');
        }).catch(function(){
            $scope.error = 'Invalid signup'
        })

    }

});