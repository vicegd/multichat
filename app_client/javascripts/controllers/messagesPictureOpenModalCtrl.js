angular.module('multichatApp')
  .controller('messagesPictureOpenModalCtrl', function($scope, $uibModalInstance, data) {
    $scope.data = data;
  });
