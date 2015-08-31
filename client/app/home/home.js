//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('homeController', ['$scope', 'appFactory', 
  function($scope, appFactory){
    ///////////////
    ///// Firebase
    ///////////////
    $scope.events = [];
    var ref = new Firebase("https://linelevel.firebaseio.com/");

    //reference events endpoint
    var eventsRef = ref.child("events");

    //fetch last 20 events
    eventsRef.limitToLast(20).on('child_added', function(snapshot){
      var data = snapshot.val();
      $scope.events.push(data);  //store data in events array
      console.log(data);
    });


    ///////////////
    ///// Genres
    ///////////////
    // saves the genre lists and method from the factory so we can access them in the DOM
    $scope.genres = appFactory.genres;
    // this is the list of the user's chosen genres
    $scope.chosenGenres = appFactory.chosenGenres;
    $scope.chooseGenre = appFactory.chooseGenre;

    // hides genre filter dropdown by default
    $scope.showGenres = false;
    // toggles genre filter dropdown view
    $scope.showGenresNow = function(){
      $scope.showGenres = !$scope.showGenres;
    };


    ///////////////
    ///// Filter
    ///////////////
    // this is the number of milliseconds that the text input filters will wait after a user stops typing to filter
    $scope.debounce = 200;

    $scope.filteredEvents = function(events){
      // only filter if the user has selected at least one filter
      if ($scope.chosenGenres.length || $scope.filterByTitle || $scope.filterByUser){

        // filter out which evens will be shown
        return events.filter(function(event){
          var show = true;

          // remove event if any of the genres chosen by the user are not in the event's genre list
          $scope.chosenGenres.forEach(function(genre){
            if (event.genre.indexOf(genre) === -1){show = false;}
          });

          // remove event if the title filter is not in the event's title
          if ($scope.filterByTitle){
            if ( event.title.toLowerCase().indexOf( $scope.filterByTitle.toLowerCase() ) === -1 ){
              console.log("$scope.filterByTitle = ", $scope.filterByTitle);
              show = false;
            }
          }

          // PLEASE NOTE: the following code has been commented out because the event objects do not currently have a user property

          // remove event if the user filter is not in the event's user
          // if ($scope.filterByUser){
          //   if ( event.user.indexOf($scope.filterByUser) === -1 ){
          //     show = false;
          //   }
          // }

          return show;
        });
      } else {
        return $scope.events;
      }
    };
  }
]);
