//attaching controllers to main until we find reason to create specific modules


angular.module('main').controller('eventController',['$scope','$http', 'appFactory', '$state',
  function($scope, $http, appFactory, $state){

    // console.log("Loading event page...");
    $scope.chatVisible = true;
    $scope.event = {};
    $scope.event.messages = [];
    $scope.event.hostMessages = [];
    $scope.isSameUser = false;
    $scope.selectedChat = [1,0,0];
    $scope.countDown = 'loading...';
    $scope.showCountDown = true;
    var chatEl     = document.getElementById('chatMessages');
    var hostChatEl = document.getElementById('hostMessages');
    var chatAlert = document.createElement('audio');
    chatAlert.setAttribute('src','../../assets/alert.wav');
    var alertActivated = false;
    var streamActivated = false;

    var hideCountDown = function(){
      if(!streamActivated){
        streamActivated = true;
        appFactory.update($scope,function(scope){
          scope.showCountDown = false;
        });
      }
    };

    // window.console.log('eventId', $scope.eventId);

    //instantiate firbase ref with url
    var initialized = false;
    var ref = appFactory.firebase;
    var userData = '';
    var chatRef = '';
    
    $scope.$watch('$scope.event.videoId', function loadVideo(a,b){
      if($scope.isSameUser !== true){
        $scope.loadStream();
      }
    });

    // initialize controller
    var init = function(){
      if(!initialized){
        initialized = !initialized;
        ref.off();
        setTimeout(function(){alertActivated = true;},1500);

        // load user data
        var userAuth = ref.getAuth();
        if(userAuth){
          window.console.log('userAuth is ', userAuth);
          ref.child("users").child(userAuth.uid).on("value",function(user){
            userData = user.val();
          });
        }

        // load event data
        ref.child("events").child($scope.eventId)
          .on("value",function(info){ 
            var eventData = info.val();
            console.log(eventData);
            $scope.event.host = eventData.host;
            $scope.event.name = eventData.title;
            $scope.event.videoId = eventData.videoId;
            $scope.event.date = eventData.date;
            appFactory.update($scope,function(scope){
              $scope.isSameUser = appFactory.user === $scope.event.host ? true : false;
            });
          console.log(appFactory.user +  $scope.event.host + $scope.isSameUser);
        });

        // load chat data and set chat listener
        chatRef = ref.child("chats").child($scope.eventId);
        chatRef.on('child_added', function(message){
          message = message.val();
          appFactory.update($scope,function(scope){
            scope.event.messages.push(message);
            if(alertActivated && userData.username !== message.username){
              chatAlert.play();
            }
            if(message.username === scope.event.host){
              scope.event.hostMessages.push(message);
            }
          });
        });

      }// end of if
    };
    init();



    var updateCountDown = function(){
      var current = (new Date()).getTime();
      var message = "Updating...";

      // modify message
      if(current > $scope.event.date && $scope.event.date !== undefined){
        message = "Event ended on " + new Date($scope.event.date).toDateString();
      } else if ($scope.event.date !== undefined){
        var timeLeft = $scope.event.date - current;
        var days = Math.floor(timeLeft / 86400000);
        timeLeft = timeLeft % 86400000;
        var hours = Math.floor(timeLeft / 3600000);
        timeLeft = timeLeft % 3600000;
        var minutes = Math.floor(timeLeft / 60000);
        timeLeft = Math.floor(timeLeft % 60000 / 1000);

        days = days > 0 ? days === 1 ? days + " day " : days + " days " : "";
        hours = hours > 0 ? hours === 1 ? hours + " hour " : hours + " hours " : "";
        minutes = minutes > 0 ? minutes === 1 ? minutes + " minute " : minutes + " minutes and " : "";
        timeLeft = timeLeft === 1 ? timeLeft + " second" : timeLeft + " seconds";
        message = "Event begins in " + days + hours + minutes + timeLeft;
      }

      // update counter
      appFactory.update($scope,function(scope){
        scope.countDown = message;
      });

      appFactory.timers.eventCounter = setTimeout(updateCountDown, 1000);
    };

    if(initialized){
      // auto scroll down in chat
      $scope.$watch(function(scope){
        return scope.event.messages.length;
      },function(a,b){
        $scope.scrollToBottom();
      });
      //testing
      clearTimeout(appFactory.timers.eventCounter);
      updateCountDown();
    }

    $scope.scrollToBottom = function(){
      setTimeout(function(){
        chatEl.scrollTop = chatEl.scrollHeight;
        hostChatEl.scrollTop = hostChatEl.scrollHeight;
      },30);
    };

    $scope.isHost = function(input){
      return $scope.event.host === input.username;
    };

    $scope.isUser = function(input){
      return userData.username === input.username;
    };

    $scope.selectTab = function(num){
      $scope.selectedChat = [0,0];
      $scope.selectedChat[num] = 1;
      $scope.scrollToBottom();
    };

    // functions to calculate time
    $scope.chatTime = function(time){
      var gap = new Date() - new Date(time);
      var prefix = '';
      var days = Math.floor(gap / 86400000);
      
      if(days > 0){
        switch(days){
          case 1: prefix += "1 day ago";
                  break;
          default: prefix += days + " days ago";
        }
        return prefix;
      } else {
        var hours = Math.floor(gap / 3600000);
        var minutes = Math.floor(gap / 60000);
        if(hours){
          if (hours === 1){
            return 'an hour ago';
          }
          return '' + hours + ' hours ago';
        } else {
          if(minutes === 1){
            return 'a minute ago';
          } else if (minutes > 1){
            return minutes + ' minutes ago';
          } else {
            return 'less than a minute ago';
          }
        }
      }
    };

    $scope.sendMessage = function(){
      var text = $scope.userText;
      if(userData && initialized && text.length > 0){
        chatRef.push({username: userData.username, message: text, timestamp: (new Date()).getTime()});
      } else {
        $scope.event.messages.push({username:"Linelevel Bot", message: "Please log in to participate in chat!"});
      }
      $scope.userText = '';
    };

    /*/////////////////////////////////////////////////////////////////////////////////////////////////////////
    CODE FOR LIVE STREAMING
    /////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    $scope.startStream = function(){
      hideCountDown();
      var peer = new Peer({key: '66p1hdx8j2lnmi',
                          debug: 3,
                          config: {'iceServers': [
                          {url: 'stun:stun.l.google.com:19302'},
                          {url: 'stun:stun1.l.google.com:19302'}
                          ]}
                        });

      peer.on('open', function(){
        ref.child("events").child($scope.eventId).update({'videoId' : peer.id});
        console.log(peer.id);

      });

      peer.on( 'connection', function(conn) {
        conn.on( 'open', function() {
          var call = peer.call(conn.peer, window.localStream);
        });
      });
      
      navigator.getUserMedia = ( navigator.getUserMedia ||
                              navigator.webkitGetUserMedia  ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia );

      // get audio/video
      navigator.getUserMedia({audio:true, video: true}, function (stream) {
          //display video
          var video = document.getElementById("myVideo");
          console.log(URL.createObjectURL(stream));
          video.src = URL.createObjectURL(stream);
          video.muted = false;
          console.log(stream.getAudioTracks()[0]);
          window.localStream = stream;
        },
        function (error) { console.log(error); }
      );

    };

    $scope.loadStream = function(){
      var peer = new Peer({key: '66p1hdx8j2lnmi'});
      console.log('video id ' + $scope.event.videoId);

      var conn = peer.connect($scope.event.videoId);

      peer.on('call', function (incomingCall) {
        hideCountDown();
        incomingCall.answer(null);
        incomingCall.on('stream', function(stream){
          var video = document.getElementById("theirVideo");
          console.log('create object url' + URL.createObjectURL(stream));
          video.src = URL.createObjectURL(stream);
          video.muted = false;
          console.log(stream.getAudioTracks());
        });
      });
    };

    $scope.stopStream = function(){
      if(window.localStream){
        window.localStream.stop();
      }else{
        console.log("You must be streaming to stop a stream!");
      }
      
    };

    $scope.$watch('$scope.event.videoId', function loadVideo(a,b){
      if($scope.isSameUser !== true){
        $scope.loadStream();
      }
    });

    $scope.editEvent = function(){
      $state.go('editevent', {eventId: $scope.eventId});
    };



    $scope.toggleChat = function(){
      // console.log($scope.chatVisible);
      $scope.chatVisible = !$scope.chatVisible;
    };

  }
  ]);

//app.module('main').requires.push('event');