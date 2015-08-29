var angular = require('angular');

var createEventController = require('./createEventController');

module.exports = angular.module('main.createEvent',[])
  .controller('createEventController', createEventController);