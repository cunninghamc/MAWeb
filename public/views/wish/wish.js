angular.module('MAapp.wish', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/views/wish/', {
        templateUrl: 'views/wish/wish.html',
        controller: 'wishCtrl'
    });
}])

.controller('wishCtrl', ['$scope', '$http', '$window', '$location', function ($scope, $http, $window, $location) {
    console.log('wish active');

    $scope.wishClicked = function () {
        console.log('wish clicked');
        $location.path('/views/main/');
        //location.hash = '#/views/library/';
    };
}]);