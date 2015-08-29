var angular = require('angular');

var auth = require('./app/authentication/index.js');
var createEventController = require('./app/createEvent/index.js');
var eventController = require('./app/event/index.js');
var home = require('./app/home/index.js');
var userProfile = require('./app/userProfile/index.js');
var appFactory = require('./factory');

var main = angular.module('main', [
  'firebase',
  'ui.router',
  auth.name,
  createEventController.name,
  eventController.name,
  home.name,
  userProfile.name
  ])

// set routes
.config(function($locationProvider, $stateProvider, $urlRouterProvider){
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'view/app/home/home.html',
      controller: 'homeController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'view/app/authentication/signup.html',
      controller: 'authController'
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'view/app/authentication/signin.html',
      controller: 'authController'
    })
    .state('userProfile', {
      url: '/userProfile/:userId',
      templateUrl: 'view/app/userProfile/userProfile.html',
      controller: function($scope, $stateParams){
        $scope.userId = $stateParams.userId;
      }
    })
    .state('createEvent', {
      url: '/createEvent',
      templateUrl: 'view/app/createEvent/createEvent.html',
      controller: 'createEventController'
    })
    .state('event', {
      url: '/event/:eventId',
      templateUrl: 'view/app/event/event.html',
      controller: function($scope, $stateParams){
        $scope.eventId = $stateParams.eventId;
      }
    });
})

//add factory
.factory('appFactory', appFactory)

// 
.run(['$state', function($state){
  $state.transitionTo('home');
}])
.controller('mainCtrl', function($scope, $firebaseObject,$state) {
  // define a reference to the firebase database
  var ref = new Firebase('https://linelevel.firebaseio.com/data');

  // download the data into a local object
  var syncObject = $firebaseObject(ref);

  // synchronize the object with a three-way data binding
  syncObject.$bindTo($scope, 'data');
  $state.go('home');
});
