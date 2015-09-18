angular.module("main").controller("createEventController",["$scope","appFactory","$firebase","$state",function($scope,appFactory,$firebase,$state){appFactory.init($scope),$scope.today=new Date,$scope.date=appFactory.date,appFactory.resetDate(),$scope.genres=appFactory.genres,$scope.chosenGenres=appFactory.chosenGenres,$scope.chooseGenre=appFactory.chooseGenre,$scope["private"]=!1,$scope.followersOnly=!0;var ref=appFactory.firebase,user=ref.getAuth();$scope.isAuth=function(){return null!==user},$scope.submitCreateEventForm=function(){var id="",eventTitle=$scope.eventTitle,eventDescription=$scope.eventDescription,eventImage=$scope.eventImage||"./assets/albumcover.png",eventLabel=$scope.eventLabel||"",eventDate=$scope.date.eventDate.getTime();console.log("eventDate = ",eventDate);var chosenGenres=$scope.chosenGenres,privateEvent=$scope["private"],followersOnly=$scope.followersOnly;if(user){var userRef=ref.child("users").child(user.uid);userRef.on("value",function(userData){userData=userData.val(),userRef.off();var username=userData.username,eventId=ref.child("events").push();id=eventId.key(),eventId.set({title:eventTitle,description:eventDescription,image:eventImage,label:eventLabel,date:eventDate,genre:chosenGenres,host:username,"private":privateEvent,followersOnly:followersOnly});for(var key in userData.followers)appFactory.sendNotification(key,{messageType:"Event",sender:"Linelevel Bot",subject:username+" has a new event!",startDate:eventDate,message:"Check out "+username+"'s event, '"+eventTitle+"'!",url:["event",eventId.key()]});ref.child("chats").child(eventId.key()).push().set({username:"Linelevel Bot",message:"chat created for event "+eventTitle,timestamp:(new Date).getTime()})}),$scope.eventTitle="",$scope.eventDescription="",$scope.eventImage="",$scope.eventLabel="",appFactory.resetDate(),appFactory.resetGenres(),console.log("event creation form submitted!"),console.log("id is ",id),$state.go("event",{eventId:id})}else console.log("please log in to create an event")}}]);