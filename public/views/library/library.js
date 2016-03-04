angular.module('MAapp.library', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/views/library/', {
        templateUrl: 'views/library/library.html',
        controller: 'libraryCtrl'
    });
}])

.controller('libraryCtrl', ['$scope', '$http', '$window', '$location', function ($scope, $http, $window, $location) {
    console.log('library active');

    $scope.libraryClicked = function () {
        console.log('library clicked');
        $location.path('/views/main/');
        //location.hash = '#/views/library/';
    };
}]);