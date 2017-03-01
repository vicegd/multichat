angular.module('multichatApp')
  .config(['growlProvider', function (growlProvider) {
    growlProvider.globalPosition('bottom-right');
    growlProvider.globalTimeToLive(2000);
  }]);

angular.module('multichatApp')
  .config(function (dropzoneOpsProvider) {
    dropzoneOpsProvider.setOptions({
      url: '/',
      dictDefaultMessage: 'Drop your picture or your file to be attached. ' +
      'You can also click here to open the File dialog'
    });
  });

//to remove the unsafe tag before the URLs when I share files converted with readAsDataURL
angular.module('multichatApp')
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(data):/);
  }]);
