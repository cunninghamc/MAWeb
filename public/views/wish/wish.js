angular.module('MAapp.wish', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/views/wish/', {
        templateUrl: 'views/wish/wish.html',
        controller: 'wishCtrl'
    });
}])

.controller('wishCtrl', ['$scope', '$http', '$window', '$location', '$rootScope', function ($scope, $http, $window, $location, $rootScope) {
    console.log('wish active');

    $scope.wishClicked = function () {
        console.log('wish clicked');
        $location.path('/views/main/');
        //location.hash = '#/views/library/';
    };

    $http({
        method: "GET",
        url: 'db_masterwishlist' + $rootScope.userID
    }).success(function (wishData) {
        console.log("Controller - wish results");

        $scope.wishResults = wishData;
        console.log("wishResults - " + $scope.wishResults);

    });


    $scope.removeWishClicked = function (gameId) {
        console.log("Controller - remove Clicked");
        removeInfo = '{ "GameID" : "' + gameId + '", "UserID" : "' + $rootScope.userID + '" }';


        $http.post("/db_remove_wish", JSON.parse(removeInfo)).success(function (status) {

            console.log("Controller - AddRating Finished");

            $http({
                method: "GET",
                url: 'db_mastergamelist' + $rootScope.userID
            }).success(function (wishData) {
                console.log("Controller - remove results");

                $scope.removeResults = wishData;
                console.log("removeResults - " + $scope.removeResults);

            });
        $http({
            method: "GET",
            url: 'db_masterwishlist' + $rootScope.userID
        }).success(function (wishData) {
            console.log("Controller - wish results");

            $scope.wishResults = wishData;
            console.log("wishResults - " + $scope.wishResults);

        });
        });

       
        
    };
   




    $scope.redirectToBgg = function (gameUrl) {
        $window.location.href = ("https://boardgamegeek.com/boardgame/" + gameUrl);
    };

}]);