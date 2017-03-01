function VideoManagement(ws, growl) {
  var muted = false;
  var video = document.getElementById('videoId');
  var source = document.getElementById('videoSource');

  source.onerror = function() {
    growl.error('The URL provided is not a valid video',{
      title: 'Error'
    });
  };

  this.setMuted = function(mute) {
    muted = mute;
  };

  this.isMuted = function() {
    return muted;
  };

  this.playVideo = function(url) {
    sendData(url);
  };

  this.updateVideoUrl = function(url) {
    if (!muted) {
      source.src = url;
      video.load();
      video.play();
    }
  };

  function sendData(url) {
    ws.send(JSON.stringify({
      'section': 'video',
      'data': {
        'url': url,
      }
    }));
  }
}