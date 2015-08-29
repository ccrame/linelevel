var angular = require('angular');

var authController = require('./authController');

module.exports = angular.module('main.auth',[])
  .controller('authController', authController);