//attaching controllers to main until we find reason to create specific modules

module.exports = function createEventController($scope, appFactory){

  // gets the current date so we can stop users from choosing dates in the past
  $scope.today = new Date();
  // gets the date from the factory and makes it accessible to the DOM
  $scope.date = appFactory.date;
  // sets the date to today and time to 7pm with no seconds
  appFactory.resetDate();

  // saves the genre lists and method from the factory so we can access them in the DOM
  $scope.genres = appFactory.genres;
  // this is the list of the user's chosen genres
  $scope.chosenGenres = appFactory.chosenGenres;
  $scope.chooseGenre = appFactory.chooseGenre;

  $scope.submitCreateEventForm = function(){
    // saves the data from the form
    var eventTitle = $scope.eventTitle;
    var eventDescription = $scope.eventDescription;
    // the image url is not required on the form
    // maybe have a default image that is used when image is not provided
    var eventImage = $scope.eventImage;
    var eventLabel = $scope.eventLabel;
    var eventDate = $scope.date.eventDate;
    var chosenGenres = $scope.chosenGenres;

    // resets the form
    $scope.eventTitle = '';
    $scope.eventDescription = '';
    $scope.eventImage = '';
    $scope.eventLabel = '';
    appFactory.resetDate();
    appFactory.resetGenres();

    // console log to test the button is functioning
    console.log("event creation form submitted!");


    // TODO: push event data to the database


    // what happens after an event is successfully created? redirect to the user's profile?
  };
};
