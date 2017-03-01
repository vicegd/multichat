angular.module('multichatApp')
  .controller('videoCtrl', function($scope, webSocketManager, $uibModal) {
    $scope.muteVideoModel = webSocketManager.videoManagement.isMuted();
    $scope.changeMuteVideoModel = function(){
      webSocketManager.videoManagement.setMuted($scope.muteVideoModel);
    };

    $scope.showVideoModal = function(selectVideo, url, accept, cancel) {
      var modal = {
        'selectVideo': selectVideo,
        'url': url,
        'accept': accept,
        'cancel': cancel
      };
      var modalInstance = $uibModal.open({
        templateUrl: 'templates/videoUrlModal.html',
        controller: 'videoModalCtrl',
        resolve: {
          data: function() {
            return modal;
          },
        }
      }).result.then(function(result) {
        webSocketManager.videoManagement.playVideo(result);
      });
    };
  });
