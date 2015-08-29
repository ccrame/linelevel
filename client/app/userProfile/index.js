var angular = require('angular');

var userProfileController = require('./userProfileController');

module.exports = angular.module('main.profile',[])
  .controller('userProfileController', userProfileController);