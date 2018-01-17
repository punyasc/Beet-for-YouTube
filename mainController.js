'use strict';
    
var beetApp = angular.module('beetApp', ['ngRoute', 'ngMaterial', 'ngResource', 'ngCookies', 'youtube-embed']);

beetApp.config(['$routeProvider',
function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'components/search/searchTemplate.html',
            controller: 'SearchController'
        }).
        when('/player/:query', {
            templateUrl: 'components/player/playerTemplate.html',
            controller: 'PlayerController'
        }).
        when('/login', {
            templateUrl: 'components/login-register/loginRegisterTemplate.html',
            controller: 'LoginRegisterController'
        }).
        when('/history/:currentId', {
            templateUrl: 'components/history/historyTemplate.html',
            controller: 'HistoryController'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

beetApp.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('blue');
    });

beetApp.controller('MainController', ['$scope', '$rootScope', '$http', '$route', '$resource', '$cookies',
function ($scope, $rootScope, $http, $route, $resource, $cookies) {
    $scope.main = {};
    $rootScope.loggedIn = false;
    if ($cookies.getObject('loggedIn').showLogout !== undefined) {
        console.log("inn", $cookies.getObject('loggedIn'));
        $rootScope.loggedIn = $cookies.getObject('loggedIn').showLogout;
    }
    $rootScope.ytAuth = "AIzaSyC95yFRvRJz95Nz7j68RJoWiKeCbozDaEM";
    $rootScope.currentUser = $cookies.getObject('currentUser');


    $rootScope.userPrefs = {
        onlyNew: true,
        sortByViews: true,
        sortByRatings: true,
        querySuffix: 'type beat'
    }

    var prefs = $cookies.getObject('userPrefs')
    if (prefs !== undefined) {
        $rootScope.userPrefs = prefs;
    }

    $scope.logout = function () {
        firebase.auth().signOut().then(function() {
            console.log("Logout successful");
            $scope.$apply(function() {
                $rootScope.loggedIn = false;
            });
            $cookies.putObject('loggedIn', {showLogout: false});
            }).catch(function(error) {
            });
        
    }


    console.log("Current User: ", $rootScope.currentUser);

    var config = {
        apiKey: "AIzaSyBBKsshG82_2teB3B5hMkL0X2y-at9rM6U",
        authDomain: "beet-60940.firebaseapp.com",
        databaseURL: "https://beet-60940.firebaseio.com",
        projectId: "beet-60940",
        storageBucket: "beet-60940.appspot.com",
        messagingSenderId: "285715277879"
    };
    $rootScope.defaultApp = firebase.initializeApp(config);
    $rootScope.defaultDatabase = firebase.database();

    $scope.$on('logged-in', function(event, args) {
        $rootScope.loggedIn = true;
        $rootScope.currentUser = args;
        $cookies.putObject('currentUser', $rootScope.currentUser);
        $cookies.putObject('loggedIn', {showLogout:true});
    });



}]);




