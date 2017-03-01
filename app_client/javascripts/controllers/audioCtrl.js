angular.module('multichatApp')
  .controller('audioCtrl', function($scope, webSocketManager, $uibModal) {
    $scope.muteAudioModel = webSocketManager.audioManagement.isMuted();
    $scope.changeMuteAudioModel = function(){
      webSocketManager.audioManagement.setMuted($scope.muteAudioModel);
    };

    $scope.showAudioModal = function(selectAudio, url, accept, cancel) {
      var modal = {
        'selectAudio': selectAudio,
        'url': url,
        'accept': accept,
        'cancel': cancel
      };
      var modalInstance = $uibModal.open({
        templateUrl: 'templates/audioUrlModal.html',
        controller: 'audioModalCtrl',
        resolve: {
          data: function() {
            return modal;
          },
        }
      }).result.then(function(result) {
        webSocketManager.audioManagement.playAudio(result);
      });
    };
  });
