//attaching controllers to main until we find reason to create specific modules

angular.module('main')

.controller('userProfileController',['$scope', 'appFactory',
  function($scope, appFactory){
    $scope.myProfile = true;
    appFactory.init($scope);
    
    if($scope.userName !== appFactory.user){
      $scope.myProfile = false;
    }

    $scope.following = [];

    $scope.followUser = function(){
      appFactory.followUser($scope.userName, true);
    };

    $scope.following = function(list, cb){
      angular.forEach(list, function(user){
        cb(user.uid);
      });
    };

    $scope.submitWallMsg = function(){
      var text = $scope.wallText;
      if(!text.length){ return;}

      appFactory.accessUserByUid(ref.getAuth().uid, function(snap){
        ref.child("usernames").child($scope.userName).on("value",function(userData){
          ref.child('users').child(userData.val().uid).child('wall').push({
            username: snap.val().username, 
            message: text,
            timestamp: (new Date()).getTime()
          });
        });
        $scope.wallText = '';
      });
    };

    $scope.getTimeStamp = function(timestamp){
      timestamp = (new Date()).getTime() - timestamp;
      var days = Math.floor(timestamp/86400000);
      timestamp%=86400000;
      var hours = Math.floor(timestamp/3600000);
      timestamp%=3600000;
      var minutes = Math.floor(timestamp/60000);
      if(days){ return '' + days + 'd';}
      if(hours){ return '' + hours+ 'h';}
      if(minutes){ return '' + minutes + 'm';}
      return '1m';
    };

    if(appFactory.auth() === true){
      var ref = appFactory.firebase;


      $scope.uData = {};
      $scope.uData.eventIds = [];
      $scope.uData.myEvents = [];
      $scope.uData.myWall = [];
      $scope.uData.uid = '';

      appFactory.accessUserByUsername($scope.userName, function(user){
        var userProfile = ref.child('users').child(user.val().uid);

        userProfile.on('value', function(snap){
          snap = snap.val();
          appFactory.update($scope, function(scope){
            scope.uData.image = snap.image || '../assets/profile.jpg';
            scope.uData.username = snap.username;
            scope.uData.firstname = snap.firstname;
            scope.uData.lastname = snap.lastname;
            scope.uData.email = snap.email;
            scope.uData.genres = snap.chosenGenres;
            scope.uData.myEvents.push(snap.currentEvents);
            scope.uData.uid = snap.uid;
            scope.following = snap.following || {};
            scope.following.Tom = {uid:"59070437-1e92-4817-b3d2-ff9d9753379d"};
          });
        });
        userProfile.off();

        userProfile.child('wall').on('child_added', function(snap){
          var data = snap.val();
          appFactory.accessUserByUsername(data.username,function(info){
            info = info.val();
            data.image = info.image || '../assets/profile.jpg';
            data.fullname = info.firstname + ' ' + info.lastname;
            appFactory.update($scope,function(scope){
              scope.uData.myWall.unshift(data);
            });
          });
        });

      });
    }




  }
]);

//app.module('main').requires.push('userProfile');