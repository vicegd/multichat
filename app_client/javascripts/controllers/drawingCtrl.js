angular.module('multichatApp')
  .controller('drawingCtrl', function($scope, webSocketManager) {
    $scope.addCircle = function(){
      webSocketManager.drawingManagement.addCircle();
    };
    $scope.addRectangle = function(){
      webSocketManager.drawingManagement.addRectangle();
    };
    $scope.addTriangle = function(){
      webSocketManager.drawingManagement.addTriangle();
    };
    $scope.getPencil = function(){
      webSocketManager.drawingManagement.getPencil();
    };
    $scope.getSelection = function(){
      webSocketManager.drawingManagement.getSelection();
    };
    $scope.clearAll = function(){
      webSocketManager.drawingManagement.clearAll();
    };
  });
