angular.module('multichatApp')
  .controller('profileCtrl', function($scope, $http, $window, $cookies) {
    $scope.data = {};
    $scope.data.errorShow = false;
    $scope.data.okShow = false;

    $scope.submit = function(profile) {
      $http({
        method : "PUT",
        url : "/api/profile",
        data : angular.toJson(profile),
        headers : {
          'Content-Type' : 'application/json'
        }
      }).then(success, error);
    };

    $scope.submitDelete = function(profile) {
      $http({
        method : "DELETE",
        url : "/api/delete/" + profile.userName,
        headers : {
          'Content-Type' : 'application/json'
        }
      }).then(successDelete, error);
    };

    function success(res) {
      $scope.data.errorShow = false;
      $scope.data.okShow = true;
      $cookies.put('token', res.data.token);
    }

    function successDelete(res) {
      $cookies.remove('token');
      $window.location.href = '/index';
    }

    function error(res) {
      $scope.data.error = res.statusText + ' (' + res.status + ')';
      $scope.data.errorShow = true;
      $scope.data.okShow = false;
    }
  });
