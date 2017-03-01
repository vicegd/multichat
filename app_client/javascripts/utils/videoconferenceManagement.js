function VideoconferenceManagement(ws, growl) {
  var constraints = { //interested in video & audio
    audio: true,
    video: true
  };
  var videoLocal = document.getElementById("videoconferenceLocal");
  var area = document.getElementById("videoconferenceArea");
  var loading = [true, true]; //server & video
  var muted = false; //by default, it is not muted
  var disabled = false; //by default, it is not disabled
  var user; //the local user
  var theStream; //to save the reference of the stream
  var peerConnections = []; //at the beginning, there are no connections
  var remotes = []; //remote multimedia stuff

  start();

  videoLocal.onloadeddata = function() {
    loading[1] = false;
    adjustSize();
  };

  window.onresize = function() {
    adjustSize();
  };

  function adjustSize() {
    videoLocal.width = area.offsetWidth/2.1;
    videoLocal.height = area.offsetWidth/2.1;
    remotes.forEach(function(remote) {
      remote.video.width = area.offsetWidth/2.1;
      remote.video.height = area.offsetWidth/2.1;
    });
  }

  function start() {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(successCallback)
      .catch(errorCallback);
  }

  function successCallback(stream) {
    theStream = stream;
    //converting a MediaStream to a blob URL
    videoLocal.src = window.URL.createObjectURL(stream);
    videoLocal.play();
    videoLocal.muted = true;
    sendData('login');
  }

  function errorCallback(err){
    videoLocal.setAttribute('poster', 'images/videoconference.png');
    growl.error('The videoconference is not available',{
      title: 'Error'
    });
  }

  this.setUser = function(userName, name) {
    user = {
      userName : userName,
      name : name
    };
  };

  this.setMuted = function(mute) {
    muted = mute;
    if (muted) { //mute myself
      theStream.getAudioTracks()[0].enabled = false;
    }
    else {
      theStream.getAudioTracks()[0].enabled = true;
    }
    remotes.forEach(function(remote) { //mute others
      remote.video.muted = mute;
    });
  };

  this.isMuted = function() {
    return muted;
  };

  this.setDisabled = function(disable) {
    disabled = disable;
    if (disabled) {
      if (theStream != null) {
        videoLocal.pause();
        theStream.getTracks().forEach(function(track) {
          track.stop();
        });
        this.setDisconnected();
        growl.info('The videoconference has been disabled', {
          title: 'Info'
        });
      }
    }
    else {
      start();
      growl.info('The videoconference has been enabled', {
        title: 'Info'
      });
    }

  };

  this.isDisabled = function() {
    return disabled;
  };

  this.setLoading = function(progress) {
    loading[0] = progress;
  };

  this.isLoading = function() {
    return loading;
  };

  function startingCallCommunication() {
    if (typeof RTCPeerConnection == "undefined")
      RTCPeerConnection = webkitRTCPeerConnection;

    //This is an optional configuration string, associated with NAT traversal
    var configuration = {
      "iceServers": [{ "urls": "stun:stun.phoneserve.com"}]
    };

    var localPeerConnection = new RTCPeerConnection(configuration);

    //Add the local stream (as returned by getUserMedia() to the local   PeerConnection
    localPeerConnection.addStream(theStream);
    //Add a handler associated with ICE protocol events
    //Handler to be called whenever a new local ICE candidate becomes available
    localPeerConnection.onicecandidate = function(event){
      if (event.candidate) {
        sendCandidate(event.candidate, getUserName(localPeerConnection));
      }
    };

    //...and a second handler to be activated as soon as the remote stream becomes available
    //Handler to be called as soon as the remote stream becomes available
    localPeerConnection.onaddstream = function gotRemoteStream(event){
      var videoRemote = document.createElement("VIDEO");
      //Associate the remote video element with the retrieved stream
      videoRemote.src = window.URL.createObjectURL(event.stream);
      videoRemote.className = 'videoRemote';
      videoRemote.play();
      videoRemote.muted = false;
      remotes.push({
        'userName': getUserName(localPeerConnection), //the other userName
        'video': videoRemote
      });
      adjustSize();
      area.appendChild(videoRemote);
    };
    return localPeerConnection;
  }

  function getUserName(localPeerConnection) {
    for (var i = 0; i < peerConnections.length; i++) {
      if (peerConnections[i].connection == localPeerConnection) {
        return peerConnections[i].userName;
      }
    }
  }

  this.getMessage = function(data) {
    switch(data.operation) {
      case 'login':
        data.others.forEach(function(user) {
          //we're all set! Create an Offer to be 'sent' to the callee
          // as soon as the local SDP is ready
          var localPeerConnection = startingCallCommunication();

          //Handler to be called when the 'local' SDP becomes available
          localPeerConnection.createOffer(
            function gotLocalDescription(description){
              sendOffer(description, user);
              localPeerConnection.setLocalDescription(description);
            },
            function onSignalingError(err) {
              console.err('Failed to create signaling message: ' + err.message);
            });

          peerConnections.push({
            'userName': user, //the other user
            'connection': localPeerConnection
          });
        });
        break;
      case 'offer':
        onOffer(data.offer, data.sourceUserName);
        break;
      case 'answer':
        onAnswer(data.answer, data.targetUserName);
        break;
      case 'candidate':
        onCandidate(data.candidate, data.userName);
        break;
      case 'leave':
        onLeave(data.userName);
        break;
      default:
        break;
    }
  };

  function onOffer(offer, sourceUserName) {
    var localPeerConnection = startingCallCommunication();
    peerConnections.push({
      'userName': sourceUserName, //the other user
      'connection': localPeerConnection
    });
    localPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    localPeerConnection.createAnswer(function(answer) {
      localPeerConnection.setLocalDescription(answer);
      sendAnswer(answer, sourceUserName);
    }, function(err) {
      console.error(err);
    });
  }

  function onAnswer(answer, targetUserName) {
    peerConnections.forEach(function(peer) {
      if (peer.userName == targetUserName) {
        peer.connection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });
  }

  function onCandidate(candidate, userName) {
    peerConnections.forEach(function(peer) {
      if (peer.userName == userName) {
        peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }

  function onLeave(userName) {
    for (var i = 0; i < peerConnections.length; i++) {
      if (peerConnections[i].userName == userName) {
        peerConnections[i].connection.close();
        peerConnections.splice(i, 1);
        i--;
      }
    }
    for (var i = 0; i<remotes.length; i++) {
      if (remotes[i].userName == userName) {
        area.removeChild(remotes[i].video);
        remotes.splice(i, 1);
        i--;
      }
    }
  }

  this.setDisconnected = function() {
    sendData('leave');
    for (var i = 0; i < peerConnections.length; i++) {
      peerConnections[i].connection.close();
      peerConnections.splice(i, 1);
      i--;
    }
    for (var i = 0; i<remotes.length; i++) {
      area.removeChild(remotes[i].video);
      remotes.splice(i, 1);
      i--;
    }
  };

  function sendData(operation) {
    ws.send(JSON.stringify({
      'section': 'videoconference',
      'data': {
        'operation': operation,
        'userName': user.userName,
      }}));
  }

  function sendOffer(description, targetUserName) {
    ws.send(JSON.stringify({
      'section': 'videoconference',
      'data': {
        'operation': 'offer',
        'sourceUserName': user.userName,
        'targetUserName': targetUserName,
        'offer': description
      }}));
  }

  function sendAnswer(answer, sourceUserName) {
    ws.send(JSON.stringify({
      'section': 'videoconference',
      'data': {
        'operation': 'answer',
        'sourceUserName': sourceUserName,
        'targetUserName': user.userName,
        'answer': answer
      }}));
  }

  function sendCandidate(candidate, otherUserName) {
    ws.send(JSON.stringify({
      'section': 'videoconference',
      'data': {
        'operation': 'candidate',
        'userName': user.userName,
        'otherUserName': otherUserName,
        'candidate': candidate
      }}));
  }
}
