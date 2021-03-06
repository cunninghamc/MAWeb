﻿
angular.module('MAapp.main', ['ngRoute'])

.run(function ($rootScope) {
    $rootScope.imgUrl = 'MAWhite.png';
    $rootScope.userLibrary = '';
})

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/views/main/', {
        templateUrl: 'views/main/main.html',
        controller: 'mainCtrl'
    });
}])

.controller('mainCtrl', ['$scope', '$rootScope', '$http', '$window', '$location', function ($scope, $rootScope, $http, $window, $location) {
    $scope.loading = false;
    console.log("Controller - Start");
   

    $scope.loginScript = function (loginStr) {
        console.log(loginStr);

        $http({
            method: "GET",
            url: '/loginSearch' + loginStr
        }).success(function (userData) {

            console.log("Controller - Login results");
            console.log(userData);
           
            $rootScope.imgUrl = userData[0].User_Color;
            $rootScope.userName = userData[0].User_Name;
            $rootScope.userID = userData[0]._id;
            $rootScope.userLibrary = userData[0].User_Library;
            $scope.loginStr = "";
            
        });

    };

    $scope.libraryClicked = function () {
        console.log('library clicked');
        $location.path('/views/library/');
       
    };

    $scope.searchClicked = function () {
        console.log('library clicked');
        $location.path('/views/search/');
       
    };

    $scope.wishClicked = function () {
        console.log('library clicked');
        $location.path('/views/wish/');
        
    };


}]);