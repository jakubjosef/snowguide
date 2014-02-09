'use strict';


// Declare app level module which depends on filters, and services
angular.module('snowguide', [
  'ngRoute',
  'ngResource',
  'ngTable',
  'angularSpinner',
  'snowguide.filters',
  'snowguide.services',
  'snowguide.directives',
  'snowguide.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
  $routeProvider.when('/sport', {templateUrl: 'partials/sport.html', controller: 'SportCtrl'});
  $routeProvider.when('/sport/:type', {templateUrl: 'partials/sport.html', controller: 'SportCtrl'});
  $routeProvider.when('/resorts', {templateUrl: 'partials/resorts.html', controller: 'ResortsCtrl'});
  $routeProvider.when('/resort/:resortID', {templateUrl: 'partials/resort_detail.html', controller: 'ResortsCtrl'});
  $routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: 'MapCtrl'});
  $routeProvider.when('/contact', {templateUrl: 'partials/contact.html', controller: 'CntCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
