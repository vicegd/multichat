angular.module('multichatApp')
  .controller('registerCtrl', function($scope, $http, $window, $cookies) {
    $scope.data = {};
    $scope.data.errorShow = false;

    $scope.submit = function(login) {
      $http({
        method : "POST",
        url : "/api/register",
        data : angular.toJson(login),
        headers : {
          'Content-Type' : 'application/json'
        }
      }).then(success, error);
    };

    function success(res) {
      $scope.data.errorShow = false;
      $cookies.put('token', res.data.token);
      $window.location.href = '/multichat';
    }

    function error(res) {
      $scope.data.error = res.statusText + ' (' + res.status + ')';
      $scope.data.errorShow = true;
    }
  });
