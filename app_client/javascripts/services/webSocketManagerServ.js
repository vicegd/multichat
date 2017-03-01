angular.module('multichatApp')
  .service('webSocketManager', function($websocket, growl, utils) {
    if (!window.WebSocket) {
      console.log("WebSockets NOT supported.");
      alert("Consider updating your browser for a better experience.");
    }

    var HOST = location.origin.replace(/^http/, 'ws');
    var ws = $websocket(HOST);
    var peopleManagement = new PeopleManagement(ws, growl);
    var messagesManagement = new MessagesManagement(ws, growl);
    var videoManagement = new VideoManagement(ws, growl);
    var audioManagement = new AudioManagement(ws, growl);
    var videoconferenceManagement = new VideoconferenceManagement(ws, growl);
    var drawingManagement = new DrawingManagement(ws);
    var geolocationManagement = new GeolocationManagement(ws, growl);
    var presentationManagement = new PresentationManagement(ws, growl);

    ws.onOpen(function() {
      peopleManagement.setLoading(false);
      messagesManagement.setLoading(false);
      videoconferenceManagement.setLoading(false);
      growl.success('Server started. Enjoy!',{
        title: 'Success',
      });
      setInterval(function() {
        ws.send('ping at ' + new Date().getUTCSeconds());
      }, 30000);
    });

    window.onbeforeunload = function() {
      //Disconnect current user
      geolocationManagement.setDisconnected();
      peopleManagement.setDisconnected();
      videoconferenceManagement.setDisconnected();
      ws.close();
    };

    ws.onMessage(function(message) {
      if(utils.isJson(message.data)) {
        var obj = JSON.parse(message.data);
        //console.log('Received: ' + obj.section);
        switch(obj.section) {
          case "people":
            if (obj.data.operation == 'connected')
              peopleManagement.addPerson(obj.data);
            else if (obj.data.operation == 'disconnected')
              peopleManagement.deletePerson(obj.data);
            break;
          case "messages":
            messagesManagement.addMessage(obj.data);
            break;
          case "video":
            videoManagement.updateVideoUrl(obj.data.url);
            break;
          case "audio":
            audioManagement.updateAudioUrl(obj.data.url);
            break;
          case "videoconference":
            videoconferenceManagement.getMessage(obj.data);
            break;
          case "drawings":
            if (obj.data.operation == 'add')
              drawingManagement.addObject(obj.data.type, obj.data.info);
            else if (obj.data.operation == 'clearAll')
              drawingManagement.clearObjects();
            break;
          case "geolocation":
            if (obj.data.operation == 'connected')
              geolocationManagement.addMarker(obj.data);
            else if (obj.data.operation == 'disconnected')
              geolocationManagement.deleteMarker(obj.data);
            break;
          case "presentation":
            presentationManagement.updateSlide(obj.data);
            break;
        }
      }
    });

    var methods = {
      ws: ws,
      peopleManagement: peopleManagement,
      messagesManagement: messagesManagement,
      videoManagement: videoManagement,
      audioManagement: audioManagement,
      videoconferenceManagement: videoconferenceManagement,
      drawingManagement: drawingManagement,
      geolocationManagement: geolocationManagement,
      presentationManagement: presentationManagement
    };

    return methods;
  });
