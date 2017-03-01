angular.module('multichatApp')
  .service('utils', function() {
    function isJson(str) {
      try {
        JSON.parse(str);
      }
      catch (e) {
        return false;
      }
      return true;
    }

    var methods = {
      isJson : isJson
    };

    return methods;
  });
