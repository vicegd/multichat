angular.module('multichatApp')
  .controller('videoconferenceCtrl', function($scope, webSocketManager) {
    $scope.data = {};
    $scope.data.loading = webSocketManager.videoconferenceManagement.isLoading();

    //Send a message to the server with the user that is connected
    var sub = $scope.sub.split("%"); //userName%name
    webSocketManager.videoconferenceManagement.setUser(sub[0],sub[1]);

    $scope.disableVideoconferenceModel =
      webSocketManager.videoconferenceManagement.isDisabled();
    $scope.changeDisableVideoconferenceModel = function(){
      webSocketManager.videoconferenceManagement.setDisabled(
        $scope.disableVideoconferenceModel);
    };

    $scope.muteVideoconferenceModel = webSocketManager.videoconferenceManagement.isMuted();
    $scope.changeMuteVideoconferenceModel = function(){
      webSocketManager.videoconferenceManagement.setMuted($scope.muteVideoconferenceModel);
    };
  });
