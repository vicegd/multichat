function GeolocationManagement(ws, growl) {
  var preLatitude;
  var preLongitude;
  var image = 'images/funchat.png';
  var markers = [];
  var map;
  var _this = this;
  var user;

  var oviedo = new google.maps.LatLng(43.383, -5.824);
  if ("geolocation" in navigator) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: oviedo,
      zoom: 3,
    });
    navigator.geolocation.watchPosition(geolocationSuccess, geolocationError);
  }
  else {
    growl.error('The browser is not compatible with the Geolocation HTML5 API',{
      title: 'Error'
    });
  }

  this.addMarker = function(data) {
    var marker = new google.maps.Marker({
      position: {
        lat: data.latitude,
        lng: data.longitude
      },
      icon: image,
      animation: google.maps.Animation.DROP,
      draggable: true,
      map: map
    });

    var markerAndUser = {
      marker : marker,
      userName : data.userName
    };

    markers.push(markerAndUser);
    var infowindow = new google.maps.InfoWindow({
      content: data.name
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

  };

  this.setUser = function(userName, name) {
    user = {
      userName : userName,
      name : name
    };
  };

  this.deleteMarker = function(data) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].userName == data.userName) {
        markers[i].marker.setMap(null);
        markers.splice(i, 1);
        i--;
      }
    }
  };

  this.setConnected = function(latitude, longitude) {
    _this.addMarker({
      'name': user.name,
      'userName': user.userName,
      'latitude': latitude,
      'longitude' : longitude
    });
    sendData(latitude, longitude, user.userName, user.name, 'connected');
  };

  this.setDisconnected = function() {
    _this.deleteMarker({
      'userName': user.userName,
    });
    sendData('', '', user.userName, user.name, 'disconnected');
  };

  function geolocationSuccess(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    if ((preLatitude != latitude)||(preLongitude != longitude)) {
      _this.setDisconnected();
      _this.setConnected(latitude, longitude);

      preLatitude = latitude;
      preLongitude = longitude;
    }

  }

  function geolocationError(position) {
    growl.error('Error trying to get the geolocation of the user',{
      title: 'Error'
    });
  }

  function sendData(latitude, longitude, userName, name, operation) {
    ws.send(JSON.stringify({
      'section': 'geolocation',
      'data': {
        'operation': operation,
        'name': name,
        'userName': userName,
        'latitude': latitude,
        'longitude' : longitude
      }}));
  }
}