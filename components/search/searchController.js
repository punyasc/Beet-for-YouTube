beetApp.controller('SearchController', ['$scope', '$resource', '$rootScope', '$location',
  function ($scope, $routeParams, $resource, $rootScope, $location, $mdDialog) {
    $scope.main = {};

    $scope.search = function() {
      if ($scope.searchQuery.length > 0) {
        var query = "#/player/" + encodeURIComponent($scope.searchQuery);
        window.location.href = query;
      }
      
    }

    $scope.createUser = function() {
      var email = "punyasc@gmail.com";
      var password = "tester";
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        console.log("User created", error.code, error.message);
        var errorCode = error.code;
        var errorMessage = error.message;
      });
    }

    

  }]);