angular.module('multichatApp')
  .controller('audioModalCtrl', function($scope, $uibModalInstance, data) {
    $scope.data = data;
    $scope.close = function(result) {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.accept = function(result) {
      result = $scope.url;
      $uibModalInstance.close(result);
    };
  });
