angular.module("main").controller("editEventController",["$scope","appFactory","$firebase","$state",function($scope,appFactory,$firebase,$state){appFactory.init($scope);var ref=appFactory.firebase,user=ref.getAuth();$scope.genres=appFactory.genres,$scope.chosenGenres=appFactory.chosenGenres,$scope.chooseGenre=appFactory.chooseGenre,$scope.today=new Date,$scope.date=appFactory.date,$scope["private"]=!1,$scope.followersOnly=!0,appFactory.resetDate(),window.test=function(){console.log("chosen ",$scope.chosenGenres),console.log("appFactory ",appFactory.chosenGenres),console.log("genres ",$scope.genres)};var init=function(){ref.child("events").child($scope.eventId).on("value",function(info){var eventData=info.val();appFactory.update($scope,function(scope){scope.eventTitle=eventData.title,scope.eventDescription=eventData.description,scope.eventImage="./assets/albumcover.png"===eventData.image?"":eventData.image,scope.eventLabel=eventData.label,appFactory.chosenGenres=eventData.genre||[],scope["private"]=eventData["private"],scope.followersOnly=eventData.followersOnly}),$scope.date.eventDate=new Date(eventData.date),appFactory.update($scope,function(scope){$scope.genres.forEach(function(genre){appFactory.chosenGenres.forEach(function(item){genre.name===item&&(genre.selected=!0)})})})})};$scope.saveChanges=function(){$scope.eventTitle=this.eventTitle;var eventTitle=this.eventTitle,eventDescription=this.eventDescription,eventImage=this.eventImage||"./assets/albumcover.png",eventLabel=this.eventLabel||"",eventDate=$scope.date.eventDate.getTime();console.log(eventTitle),console.log(eventDescription);var privateEvent=this["private"],followersOnly=this.followersOnly,eventRef=ref.child("events").child($scope.eventId);eventRef.update({title:eventTitle,description:eventDescription,image:eventImage,label:eventLabel,date:eventDate,"private":privateEvent,followersOnly:followersOnly}),eventRef.child("genre").set(appFactory.chosenGenres),appFactory.resetGenres(),$state.go("event",{eventId:$scope.eventId})},$scope.isAuth=function(){return null!==user},init()}]).directive("autofill",["$timeout",function($timeout){return{scope:!0,require:"ngModel",link:function(scope,elem,attrs,ctrl){$timeout(function(){$(elem[0]).trigger("input")},200)}}}]);