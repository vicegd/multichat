module.exports = function(httpsServer) {
  var config = require('../config');
  var WebSocketServer = require('ws').Server;

  var wss = new WebSocketServer({
    'server': httpsServer
  });

  wss.on('error', onError);
  wss.on('listening', onListening);
  //to save all the connections from clients as well as other info
  var connections = [];

  wss.on('connection', function(ws) {
    console.log('Creating connection with WebSocketServer');

    ws.on('message', function(message) {
      console.log('Received: %s', message);
      if (isJson(message)) {
        var obj = JSON.parse(message);
        switch (obj.section) {
          case 'people':
            if (obj.data.operation == 'connected') {
              connections.push({
                'ws': ws,
                'user': {
                  'userName': obj.data.userName,
                  'name': obj.data.name
                },
                'geo': {
                  'latitude': '',
                  'longitude': '',
                },
                'videoconference': {
                  'enabled': false
                }
              });
              broadcast(message, obj.data.userName); //to notify others
              loadInfoFromOthers(ws, obj.data.userName);
            }
            else if (obj.data.operation == 'disconnected') {
              broadcast(message, obj.data.userName); //to notify others
              disconnectUser(obj.data.userName);
            }
            break;
          case 'video':
            broadcast(message, ''); //to notify everybody
            break;
          case 'audio':
            broadcast(message, ''); //to notify everybody
            break;
          case 'drawings':
            broadcast(message, ''); //to notify everybody
            break;
          case 'presentation':
            broadcast(message, obj.data.userName); //to notify others
            break;
          case 'messages':
            broadcast(message, ''); //to notify everybody
            break;
          case 'videoconference':
            switch (obj.data.operation) {
              case 'login':
                setVideoconferenceEnabled(obj.data.userName, true);
                var response = {
                  'section': 'videoconference',
                  'data': {
                    'operation': 'login',
                    'others': getOtherUserNames(obj.data.userName)
                  }};
                ws.send(JSON.stringify(response)); //to notify this user
                break;
              case 'offer':
                sendTo(message, obj.data.targetUserName); //to notify targetUserName
                break;
              case 'answer':
                sendTo(message, obj.data.sourceUserName); //to notify sourceUserName
                break;
              case 'candidate':
                sendTo(message, obj.data.otherUserName); //to notify the other part
                break;
              case 'leave':
                setVideoconferenceEnabled(obj.data.userName, false);
                broadcast(message, obj.data.userName); //to notify others
                break;
              default:
                console.log('Unrecognized message regarding the videoconference');
                break;
            }
            break;
          case 'geolocation':
            if (obj.data.operation == 'connected') {
              setGeolocation(obj.data.userName, obj.data.latitude, obj.data.longitude);
              broadcast(message, obj.data.userName); //to notify others
            }
            else if (obj.data.operation == 'disconnected') {
              broadcast(message, obj.data.userName); //to notify others
            }
            break;
          default:
            console.log('Unrecognized message');
            break;
        }
      }
    });

    ws.on('close', function () {
      console.log('Closing connection with WebSocketServer');
    });

    broadcast = function(message, sentBy) {
      connections.forEach(function(cnn) {
        if (cnn.user.userName != sentBy) {
          console.log('Sent: %s to %s', message, cnn.user.userName);
          if (cnn.ws) cnn.ws.send(message);
        }
      });
    };

    loadInfoFromOthers = function broadcast(ws, sentBy) {
      connections.forEach(function (cnn) {
        if (cnn.user.userName != sentBy) {
          var message = {
            'section': 'people',
            'data': {
              'operation': 'connected',
              'name': cnn.user.name,
              'userName': cnn.user.userName
            }
          };
          console.log('**Sent: %s to %s', JSON.stringify(message), sentBy);
          if (ws) ws.send(JSON.stringify(message));
          var message = {
            'section': 'geolocation',
            'data': {
              'operation': 'connected',
              'name': cnn.user.name,
              'userName': cnn.user.userName,
              'latitude': cnn.geo.latitude,
              'longitude': cnn.geo.longitude
            }
          };
          console.log('**Sent: %s to %s', JSON.stringify(message), sentBy);
          if (ws) ws.send(JSON.stringify(message));
        }
      });
    };

    disconnectUser = function(sentBy) {
      for (var i = 0; i < connections.length; i++) {
        if (connections[i].user.userName == sentBy) {
          connections.splice(i, 1);
          i--;
        }
      }
    };

    setGeolocation = function(sentBy, latitude, longitude) {
      for (var i = 0; i < connections.length; i++) {
        if (connections[i].user.userName == sentBy) {
          connections[i].geo = {
            'latitude': latitude,
            'longitude': longitude
          }
        }
      }
    };

    setVideoconferenceEnabled = function(sentBy, enabled) {
      for (var i = 0; i < connections.length; i++) {
        if (connections[i].user.userName == sentBy) {
          connections[i].videoconference = {
            'enabled': enabled,
          }
        }
      }
    };

    getOtherUserNames = function(sentBy) {
      var others = [];
      connections.forEach(function(cnn) {
        if (cnn.user.userName != sentBy) {
          if (cnn.videoconference.enabled)
            others.push(cnn.user.userName);
        }
      });
      return others;
    };

    sendTo = function(message, sentTo) {
      connections.forEach(function(cnn) {
        if (cnn.user.userName == sentTo) {
          console.log('Sent: %s to %s', message, sentTo);
          if (cnn.ws) cnn.ws.send(message);
        }
      });
    };

  });

  function isJson(str) {
    try {
      JSON.parse(str);
    }
    catch (e) {
      return false;
    }
    return true;
  }

  function onError(err) {
    console.error(err.message);
    process.exit(1);
  }

  function onListening() {
    console.log('The Websocket server is running on PORT: ' + config.port);
  }
};