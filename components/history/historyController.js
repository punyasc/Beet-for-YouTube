beetApp.controller('HistoryController', ['$scope', '$routeParams', '$resource', '$rootScope', '$location',
  function ($scope, $routeParams, $resource, $rootScope, $location, $mdDialog, $cookies) {
    $scope.main = {};
    $scope.idList = [];
    $scope.titles = [];
    $scope.videoItems = [];
    $scope.titledItems = [];
    var myUserId = $routeParams.currentId;
    $scope.loadList = function() {
        var userHistoryRef = firebase.database().ref('users/' + myUserId + '/history');
        userHistoryRef.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              var childKey = childSnapshot.key;
              var childData = childSnapshot.val();
              $scope.videoItems.push(childData);
            });
            $scope.$broadcast('doneLoading');
          });
    }
    $scope.loadList();

    $scope.getDate = function(timestamp) {
        var date = new Date(timestamp);
        console.log("TS", date.toDateString());
        return date.toLocaleTimeString() + ", " + date.toLocaleDateString();
    }
    
    $scope.$on('doneLoading', function(event, args) {
        console.log('DONE LOADING', $scope.videoItems);
        $scope.$apply(function() {
            var baseUrl = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&'
            var idQuery = 'id=';
            for (item of $scope.videoItems) {
                idQuery += item.id;
                if (item.id != $scope.videoItems[$scope.videoItems.length - 1]) {
                    idQuery += ",";
                }
            }
            baseUrl += idQuery + '&key=' + $rootScope.ytAuth;
            var res = $resource(baseUrl);
            res.get(function(model) {
                for (var i = 0; i < model.items.length; i++) {
                    $scope.videoItems[i].title = model.items[i].snippet.title;
                }
            });
        })
    })

  }]);