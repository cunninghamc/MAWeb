'use strict';

// Declare app level module which depends on views, and components
angular.module('MAapp', [
  'ngRoute',
  'ngAnimate',
  'alAngularHero',
  'MAapp.main',
  'MAapp.library',
  'MAapp.search',
  'MAapp.wish'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/views/main'});
}]);
