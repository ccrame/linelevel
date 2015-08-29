var angular = require('angular');

var eventController = require('./eventController');

module.exports = angular.module('main.event', [])
  .controller('eventController', eventController);