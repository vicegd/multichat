angular.module('multichatApp')
  .directive("userNameAvailable", function($http, $q) {
    return {
      restrict: 'A',
      require: "ngModel",
      link: function(scope, element, attributes, modelVal) {

        modelVal.$asyncValidators.userNameAvailable = function(val) {

          var defer = $q.defer();

          $http.get("api/users/" + val, {
            headers : {
              'Content-Type' : 'application/json'
            }
          }).then(success, error);

          function success(res) {
            scope.data.errorShow = false;
            if (res.data.length > 0) { //the user already exists
              modelVal.$setValidity('userNameAvailable', false);
              defer.reject("Username has already been taken");
            } else {
              modelVal.$setValidity('userNameAvailable', true);
              defer.resolve();
            }
          }

          function error(res) {
            scope.data.error = res.statusText + ' (' + res.status + ')';
            scope.data.errorShow = true;
            modelVal.$setValidity('userNameAvailable', false);
            defer.reject("An error has been occurred");
          }
          return defer.promise;
        }

      }
    };
  });
