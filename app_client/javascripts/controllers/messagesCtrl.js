angular.module('multichatApp')
  .controller('messagesCtrl', function($scope, webSocketManager, $uibModal) {
    //Send a message to the server with the user that is connected
    var sub = $scope.sub.split("%"); //userName%name
    webSocketManager.messagesManagement.setUser(sub[0],sub[1]);
    $scope.userName = sub[0];
    $scope.data = {};
    $scope.data.loading = webSocketManager.messagesManagement.isLoading();
    $scope.data.messages = webSocketManager.messagesManagement.getMessages();
    $scope.comment = '';

    $scope.commentSent = function() {
      webSocketManager.messagesManagement.sendMessage($scope.comment);
      $scope.comment = '';
    };

    $scope.checkEnter = function(event) {
      if (event.keyCode == 13) { //ASCII for enter
        webSocketManager.messagesManagement.sendMessage($scope.comment);
        $scope.comment = '';
      }
    };

    $scope.iconSent = function(icon) {
      $scope.comment += icon;
    };

    $scope.showAllEmojis = function() {
      $scope.showEmojis = !$scope.showEmojis;
    };

    $scope.showFileModal = function(selectAudio, url, accept, cancel) {
      var modalInstance = $uibModal.open({
        templateUrl: 'templates/messageFileModal.html',
        controller: 'messagesFileModalCtrl',
      }).result.then(function(result) {
        if (result == "Too big") {
          webSocketManager.messagesManagement.showError("The file cannot be sent " +
            "because it exceeds the maximum allowed size");
        }
        else {
          switch (result.type) {
            case "image/png":
            case "image/gif":
            case "image/jpeg":
              webSocketManager.messagesManagement.sendFile(result, "picture");
              break;
            default:
              webSocketManager.messagesManagement.sendFile(result, "attached");
              break;
          }
        }
      });
    };

    $scope.showPictureOpenModal = function(picture) {
      var modal = {
        'picture': picture,
      };
      var modalInstance = $uibModal.open({
        templateUrl: 'templates/messagePictureOpenModal.html',
        controller: 'messagesPictureOpenModalCtrl',
        size: 'lg',
        resolve: {
          data: function() {
            return modal;
          },
        }
      })
    };
  });