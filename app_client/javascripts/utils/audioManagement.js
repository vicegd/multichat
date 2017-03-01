function AudioManagement(ws, growl) {
  var muted = false;
  var audio = document.getElementById('audioId');
  var source = document.getElementById('audioSource');

  source.onerror = function() {
    growl.error('The URL provided is not a valid audio',{
      title: 'Error'
    });
  };

  this.setMuted = function(mute) {
    muted = mute;
  };

  this.isMuted = function() {
    return muted;
  };

  this.playAudio = function(url) {
    sendData(url);
  };

  this.updateAudioUrl = function(url) {
    if (!muted) {
      source.src = url;
      audio.load();
      audio.play();
    }
  };

  function sendData(url) {
    ws.send(JSON.stringify({
      'section': 'audio',
      'data': {
        'url': url,
      }
    }));
  }
}