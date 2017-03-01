function MessagesManagement(ws, growl) {
  var messages = {};
  messages.loading = [true];
  messages.list = [];
  var user;

  this.setUser = function(userName, name) {
    user = {
      userName : userName,
      name : name
    };
  };

  this.addMessage = function(data) {
    messages.list.unshift(data);
  };

  this.setLoading = function(progress) {
    messages.loading[0] = progress;
  };

  this.getMessages = function() {
    return messages.list;
  };

  this.isLoading = function() {
    return messages.loading;
  };

  this.sendMessage = function(text) {
    sendData(text);
  };

  this.showError = function(message) {
    growl.error(message,{
      title: 'Error'
    });
  };

  this.sendFile = function(file, operation) {
    var fr = new FileReader();
    fr.onloadend = function() {
      ws.send(JSON.stringify({
        'section': 'messages',
        'data': {
          'operation': operation,
          'name': user.name,
          'userName': user.userName,
          'binary' : fr.result,
          'name' : file.name,
        }}));
    };
    fr.readAsDataURL(file);
  };

  function sendData(text) {
    ws.send(JSON.stringify({
      'section': 'messages',
      'data': {
        'operation': 'text',
        'name': user.name,
        'userName': user.userName,
        'text' : text
      }}));
  }
}