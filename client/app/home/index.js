var angular = require('angular');

var homeController = require('./homeController');

module.exports = angular.module('main.home',[])
  .controller('homeController',homeController);