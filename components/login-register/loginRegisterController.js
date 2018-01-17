beetApp.controller('LoginRegisterController', ['$scope', '$resource', '$rootScope', '$location',
  function ($scope, $routeParams, $resource, $rootScope, $location, $mdDialog) {
    $scope.main = {};

    $scope.showError = false;
    $scope.errorMsg = 'Sign In';

    $scope.register = function() {
        const email = $scope.emailField;
        const password = $scope.passwordField;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
            // user created
            $scope.$apply(function () {
                $scope.showError = false;
                $scope.$parent.$broadcast('logged-in', user);
            });
            

            window.location.href = "#/";
            console.log("User created", user);
         }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error register", errorCode, errorMessage);
            $scope.$apply(function () {
                $scope.errorMsg = errorMessage;
                $scope.showError = true;
            });
          });
    }

    $scope.login = function() {
        const email = $scope.emailField;
        const password = $scope.passwordField;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
            // user logged in
            $scope.$apply(function () {
                $scope.showError = false;
                $scope.$parent.$broadcast('logged-in', user);
            });
            //$rootScope.$broadcast('logged-in');
            window.location.href = "/";
            console.log("User logged in", user);
         }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error register", errorCode, errorMessage);
            $scope.$apply(function () {
                $scope.errorMsg = errorMessage;
                $scope.showError = true;
            });
            
          });
    }

    $scope.forgotPassword = function() {
        const emailAddress = $scope.emailField;
        firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
        }).then(function(msg) {
            // user logged in
            console.log("Email sent", msg);
         }).catch(function(error) {
            console.log("Email not sent", error);
        });
    }

    

  }]);