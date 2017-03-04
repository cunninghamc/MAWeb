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
        url: 'db_mastergamelist' + $rootScope.userID
    }).success(function (wishData) {
        console.log("Controller - wish results");

        $scope.wishResults = wishData;
        console.log("wishResults - " + $scope.wishResults);


    });

    $scope.WishRating = "";

    $scope.WishRatings = ['1-Must Have', '2-Really Want', '3-Nice to Have', '4-Interested'];

    $scope.dropboxratingselected = function (gameData, UserName, rating) {

        console.log("wishData - " + gameData + "~" + UserName + "~" + rating);

        $scope.WishRating = rating;

        updateData = '{"Game_Wishers" : "' + $rootScope.userLibrary + '"}';
        var data = { Game: + gameData, User: UserName, Rate: rating };

        $http.put("/db_update_masterwishlist", data).success(function (status) {

            console.log("Controller - UpdateWishList Finished");
            console.log("status = " + status);

       });
        $http({
            method: "GET",
            url: 'db_mastergamelist' + $rootScope.userID
        }).success(function (wishData) {
            console.log("Controller - wish results");

            $scope.wishResults = wishData;
            console.log("wishResults - " + $scope.wishResults);


        });

    }

    $scope.WisherName = $rootScope.userName;

    $scope.Wishers = ['Cameron', 'Bekah', 'Justin', 'Diane'];

    $scope.dropboxitemselected = function (item) {
        $scope.WisherName = item;
    }


    $scope.removeWishClicked = function (gameId) {
        console.log("Controller - remove Clicked");
        removeInfo = '{ "GameID" : "' + gameId + '", "UserID" : "' + $rootScope.userName + '" }';


        $http.post("/db_remove_wish", JSON.parse(removeInfo)).success(function (status) {

            console.log("Controller - Wish Remove Finished");

            $http({
                method: "GET",
                url: 'db_mastergamelist' + $rootScope.userID
            }).success(function (wishData) {
                console.log("Controller - wish results");

                $scope.wishResults = wishData;
                console.log("wishResults - " + $scope.wishResults);


            });
       

        });
       

       
        
    };
   

    $scope.OwnWishClicked = function (gameId) {
        console.log("Controller - remove Clicked");
        removeInfo = '{ "GameID" : "' + gameId + '", "UserID" : "' + $rootScope.userName + '", "LibraryID" : "' + $rootScope.userLibrary + '" }';


        $http.post("/db_wish_to_own", JSON.parse(removeInfo)).success(function (status) {

            console.log("Controller - Wish Remove Finished");

            $http({
                method: "GET",
                url: 'db_mastergamelist' + $rootScope.userID
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