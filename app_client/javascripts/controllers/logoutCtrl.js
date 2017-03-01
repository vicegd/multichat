angular.module('multichatApp')
  .controller('logoutCtrl', function($cookies) {
    $cookies.remove('token');
  });
