angular.module('multichatApp', ['angular-websocket', 'ngMaterial', 'angular-growl',
  'ui.bootstrap', 'ngCookies', 'ngSanitize', 'thatisuday.dropzone']);

var config = {};
config.maxSizeAttachment = 500000; //500 KB