//attaching controllers to main until we find reason to create specific modules

module.exports = function eventController(){
  $scope.test = function(){
    console.log("it's working!");
  };
};

//app.module('main').requires.push('event');