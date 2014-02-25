'use strict';


// Declare app level module which depends on filters, and services
angular.module('snowguide', [
  'ui.bootstrap',
  'ngRoute',
  'ngResource',
  'ngTable',
  'angular-objectForm',
  'angularSpinner',
  'snowguide.filters',
  'snowguide.services',
  'snowguide.directives',
  'snowguide.controllers',
  'UserApp'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl',public:true});
  $routeProvider.when('/sport', {templateUrl: 'partials/sport.html', controller: 'SportCtrl',public:true});
  $routeProvider.when('/sport/:sportType', {templateUrl: 'partials/sport.html', controller: 'SportCtrl',reloadOnSearch: false,public:true});
  $routeProvider.when('/resorts', {templateUrl: 'partials/resorts.html', controller: 'ResortsCtrl',public:true});
  $routeProvider.when('/resort/:resortID', {templateUrl: 'partials/resort_detail.html', controller: 'ResortsCtrl',public:true});
  $routeProvider.when('/map', {templateUrl: 'partials/map.html', controller: 'MapCtrl',public:true});
  $routeProvider.when('/contact', {templateUrl: 'partials/contact.html', controller: 'CntCtrl',public:true});
  $routeProvider.when('/admin', {templateUrl: 'partials/admin/login.html', controller:'AdminCtrl', login: true});
  $routeProvider.when('/admin/index', {templateUrl: 'partials/admin/index.html',controller:'AdminCtrl'});
  $routeProvider.when('/admin/signup', {templateUrl: 'partials/admin/signup.html', public: true});
  $routeProvider.when('/admin/verify-email', {templateUrl: 'partials/admin/verify-email.html', verify_email: true});
  $routeProvider.when('/admin/reset-password', {templateUrl: 'partials/admin/reset-password.html', public: true});
  $routeProvider.when('/admin/set-password', {templateUrl: 'partials/admin/set-password.html', set_password: true});
  $routeProvider.otherwise({redirectTo: '/home'});
}]).
run(function($rootScope, user){
  user.init({appId: '5307347d82a1a'});
});
String.prototype.capitalize = function () {
    return this.replace(/^./, function (char) {
        return char.toUpperCase();
    });
};