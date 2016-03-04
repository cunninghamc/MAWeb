
angular.module('MAapp.main', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/views/main/', {
        templateUrl: 'views/main/main.html',
        controller: 'mainCtrl'
    });
}])

.controller('mainCtrl', ['$scope', '$http', '$window', '$location', function ($scope, $http, $window, $location) {
    $scope.loading = false;
    console.log("Controller - Start");
    $scope.imgUrl = '/images/MAWhite.png';

    $scope.loginScript = function (loginStr) {
        console.log(loginStr);

        $http({
            method: "GET",
            url: '/loginSearch' + loginStr
        }).success(function (userData) {

            console.log("Controller - Login results");
            console.log(userData);
            console.log(userData[0].User_Color);

            $scope.imgUrl = userData[0].User_Color;
            $scope.userName = userData[0].User_Name;
            $scope.userLibrary = userData[0].User_Library;
            $scope.userWishList = userData[0].User_WishList;
            
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