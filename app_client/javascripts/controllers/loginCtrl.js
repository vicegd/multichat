angular.module('multichatApp')
  .controller('loginCtrl', function($scope, $http, $window, $cookies) {
    $scope.data = {};
    $scope.data.errorShow = false;
    $scope.data.userNotValid = false;
    $scope.submit = function(login) {
      console.log(login);
      $http({
        method : "POST",
        url : "/api/login",
        data : angular.toJson(login),
        headers : {
          'Content-Type' : 'application/json'
        }
      }).then(success, error);
    };

    function success(res) {
      $scope.data.errorShow = false;
      $scope.data.userNotValid = false;
      $cookies.put('token', res.data.token);

      if ($scope.redirect != 'undefined')
        $window.location.href = $scope.redirect;
      else
        $window.location.href = '/multichat';
    }

    function error(res) {
      if (res.status == 401) {
        $scope.data.userNotValid = true;
      }
      else {
        $scope.data.error = res.statusText + ' (' + res.status + ')';
        $scope.data.errorShow = true;
      }
    }
  });
