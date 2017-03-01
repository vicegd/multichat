function PresentationManagement(ws, growl) {
  var iframe = document.getElementById('iframe');
  var reveal;
  var user;

  iframe.onload = function() {
    reveal = iframe.contentWindow.Reveal;
    reveal.addEventListener('slidechanged', updateOthers);
  };

  function updateOthers(event) {
    sendData(event.indexh, event.indexv);
  }

  this.updateSlide = function(data) { //from the outside
    reveal.removeEventListener('slidechanged', updateOthers);
    reveal.slide(data.indexh, data.indexv);
    reveal.addEventListener('slidechanged', updateOthers);
  };

  this.setUser = function(userName, name) {
    user = {
      userName : userName,
      name : name
    };
  };

  function sendData(indexh, indexv) {
    ws.send(JSON.stringify({
      'section': 'presentation',
      'data': {
        'indexh': indexh,
        'indexv': indexv,
        'userName': user.userName
      }}));
  }
}