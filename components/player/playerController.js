beetApp.controller('PlayerController', ['$scope', '$routeParams', '$resource', '$rootScope', '$location',
  function ($scope, $routeParams, $resource, $rootScope, $location, $mdDialog) {
    $scope.main = {};
    $scope.videoURL = 'https://www.youtube.com/watch?v=tx4UfQL5ZKY';
    //$scope.defaultVideo = '4UfQL5ZKY';
    $scope.queue = [];
    var tag = document.createElement('script');
    tag.src = 'https://youtube.com/iframe_api';
    var sourceTag = document.getElementsByTagName('script')[0];
    sourceTag.parentNode.insertBefore(tag, sourceTag);

    $scope.playerVars = {
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      origin: 'http://localhost:8080',
      autoplay: 1
    };

    var query = $routeParams.query;
    var nextPageToken = '';

    if (query !== undefined) {
        console.log("Got query: " + query);
      $scope.searchQuery = query
      var res = $resource('https://www.googleapis.com/youtube/v3/search?part=id&maxResults=10&q=' + query + 'type%20beat&key=' + $rootScope.ytAuth);
      res.get(function(model) {
        nextPageToken = model.nextPageToken
        for (var vid of model.items) {
          $scope.queue.unshift(vid.id.videoId);
          console.log("VID", vid.id.videoId);
        }
        var nowPlayingId = $scope.queue.shift();
        $scope.defaultVideo = nowPlayingId;
        firebase.database().ref('users/' + $scope.currentUser.uid + '/history/' + nowPlayingId).set(true);
        $scope.setTitle(nowPlayingId);
      });

    } 

    $scope.isPlaying = false;
    $scope.isLooping = false;

    $scope.search = function() {
      window.location.href = "#/player/" + encodeURIComponent($scope.searchQuery);
    }

    $scope.setLooping = function() {
      $scope.isLooping = !$scope.isLooping;
      let btn = document.getElementById("loopbutton");
      if ($scope.isLooping) {
        btn.className = "btn btn-warning btn-player";
      } else {
        btn.className = "btn btn-player";
      }
    }

    /* Player Controls */
    $scope.play = function() {
      $scope.isPlaying = true;
      $scope.myPlayer.playVideo()
    }

    $scope.pause = function() {
      $scope.isPlaying = false;
      $scope.myPlayer.pauseVideo()
    }

    $scope.nextSong = function() {
      if ($scope.queue.length > 0) {
        $scope.loadNextVideo()
      } else {
        $scope.getNextPage()
      }
    }

    $scope.loadNextVideo = function() {
      var nowPlayingId = $scope.queue.shift();

      var historyIdRef = firebase.database().ref('users/' + $scope.currentUser.uid + '/history').orderByChild('id').equalTo(nowPlayingId);
      historyIdRef.once('value', function(snapshot) {
        var count = 0;
        snapshot.forEach(function(childSnapshot) {
          count++;
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          console.log(">> ", count);
          // ...
        });

        if ($rootScope.userPrefs.newOwnly && count > 0) {
          console.log("SEEN, Skipping");
          $scope.loadNextVideo();
          return;
        }
        var timestamp = new Date().getTime();
        $scope.myPlayer.loadVideoById(nowPlayingId);
        var videoItem = {id: nowPlayingId, timestamp: timestamp}
        var addVideoRef = firebase.database().ref('users/' + $scope.currentUser.uid + '/history').push();
        addVideoRef.set(videoItem);  
        $scope.setTitle(nowPlayingId);  

      });

      
    }

    $scope.getNextPage = function() {
      var res = $resource('https://www.googleapis.com/youtube/v3/search?part=id&maxResults=10&q=' + query + 'type%20beat&key=' + $rootScope.ytAuth + '&pageToken=' + nextPageToken);
      res.get(function(model) {
        nextPageToken = model.nextPageToken
        for (var vid of model.items) {
          $scope.queue.unshift(vid.id.videoId);
          console.log("VID", vid.id.videoId);
        }
        $scope.nextSong();
      });
    }

    $scope.setTitle = function(id) {
      var res = $resource('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + id + '&key=' + $rootScope.ytAuth);
      res.get(function(model) {
        console.log(model);
          $scope.nowPlayingTitle = model.items[0].snippet.title;
      });
    }

    /* Event Listeners */
    $scope.$on('youtube.player.ready', function ($event, player) {
      $scope.myPlayer.playVideo();
    });

    $scope.$on('youtube.player.ended', function ($event, player) {
      // play it again
      console.log("Video ended");
      if (!$scope.isLooping) {
        $scope.nextSong()
      } else {
        $scope.myPlayer.playVideo();
      }
    });

    $scope.$on('youtube.player.playing', function ($event, player) {
      $scope.isPlaying = true;
    });

    $scope.$on('youtube.player.paused', function ($event, player) {
      $scope.isPlaying = false;
    });

    $scope.$on('youtube.player.buffering', function ($event, player) {
      $scope.isPlaying = false;
    });

    /* Keypress detectors */
    document.addEventListener("keypress", function(event) {
      switch (event.keyCode) {
        case 32:
          console.log("SPACE");
          if ($scope.isPlaying) {
            $scope.pause();
          } else {
            $scope.play();
          }
          break;
        case 37:
          console.log("LEFT");
          $scope.setLooping();
          break;
        case 38:
          console.log("UP");
          break;
        case 39:
          console.log("RIGHT");
          $scope.nextSong();
          break;
        case 40:
          console.log("DOWN");
          break;
        default:
          break;
      }
    });

  }]);