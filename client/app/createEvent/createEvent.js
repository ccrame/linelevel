//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('createEventController', ['$scope', 'appFactory', 
  function($scope, appFactory){

    // saves the genre lists and method from the factory so we can access them in the DOM
    $scope.genres = appFactory.genres;
    $scope.chosenGenres = appFactory.chosenGenres;
    $scope.chooseGenre = appFactory.chooseGenre;

    $scope.submitCreateEventForm = function(){
      // saves the data from the form and clears the fields
      var eventTitle = $scope.eventTitle;
      var eventDescription = $scope.eventDescription;
      // the image url is not required on the form
      // maybe have a default image that is used when image is not provided
      var eventImage = $scope.eventImage;
      var eventLabel = $scope.eventLabel;


      // console log to test the button is functioning
      console.log("event creation form submitted!");


      // TODO: push event data to the database


      // what happens after an event is successfully created? redirect to the user's profile?
    };

  }
]);


//app.module('main').requires.push('createEvent');