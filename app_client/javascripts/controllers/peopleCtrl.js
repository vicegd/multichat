angular.module('multichatApp')
  .controller('peopleCtrl', function($scope, webSocketManager) {
    //Send a message to the server with the user that is connected
    var sub = $scope.sub.split("%"); //userName%name
    webSocketManager.peopleManagement.setConnected(sub[0],sub[1]);

    $scope.data = {};
    //At the beginning there is an animation showing that the info is loading
    $scope.data.loading = webSocketManager.peopleManagement.isLoading();
    //When $scope.data.loading and $scope.data.people change, the list of users is shown
    $scope.data.people = webSocketManager.peopleManagement.getPeople();
  });
