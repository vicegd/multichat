angular.module('multichatApp')
  .directive("compareTo", function() {
    return {
      restrict: 'A',
      require: "ngModel",
      scope: {
        elementToCompare: "=compareTo"
      },
      link: function(scope, element, attributes, modelVal) {

        modelVal.$validators.compareTo = function(val) {
          return val == scope.elementToCompare;
        };

        scope.$watch("elementToCompare", function() {
          modelVal.$validate();
        });
      }
    };
  });
