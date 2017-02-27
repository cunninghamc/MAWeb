angular.module('MAapp.library', ['ngRoute','ngAnimate', 'ngSanitize', 'ui.bootstrap'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/views/library/', {
        templateUrl: 'views/library/library.html',
        controller: 'libraryCtrl'
    });
}])

.controller('libraryCtrl', ['$scope', '$http', '$window', '$location', '$rootScope', function ($scope, $http, $window, $location, $rootScope) {
    console.log('library active');

    $scope.libraryClicked = function () {
        console.log('library clicked');
        $location.path('/views/main/');
        //location.hash = '#/views/library/';
    };

    $scope.LibraryName = "Cunningham";
    $scope.Librarys = ['Cunningham', 'Lueders'];

    $scope.dropboxitemselected = function (item) {
        $scope.LibraryName = item;
    }

    $http({
        method: "GET",
        url: 'db_mastergamelist' + $rootScope.userLibrary
    }).success(function (libraryData) {
        console.log("Controller - library results");
        
        $scope.libraryResults = libraryData;
        console.log("libraryResults - " + $scope.libraryResults);
       
    });
    
    $scope.max = 5;
    $scope.hoveringOver = function (value) {
        $scope.overStar = value;

    };

    $scope.ratingClicked = function (gameId) {       

        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            
        };

        console.log("----starclicked ----- " + $scope.overStar);

        //jsonInfo = '{ "User" : "' + $rootScope.userID + '", "Rating" : ' + $scope.overStar + ' }';

        jsonInfo = '{ "GameID" : "' + gameId + '", "UserID" : "' + $rootScope.userName + '", "GameRating" : ' + $scope.overStar + ' }';
        

        $http.post("/db_insert_gameRating", JSON.parse(jsonInfo)).success(function (status) {

            console.log("Controller - AddRating Finished");

            $http({
                method: "GET",
                url: 'db_mastergamelist' + $rootScope.userLibrary
            }).success(function (libraryData) {
                console.log("Controller - library results");

                $scope.libraryResults = libraryData;
                console.log("libraryResults - " + $scope.libraryResults);

            });

        });

    };


    $scope.removeClicked = function (gameId) {
        console.log("Controller - remove Clicked");
        removeInfo = '{ "GameID" : "' + gameId + '", "UserID" : "' + $rootScope.userLibrary + '" }';


        $http.post("/db_remove_game", JSON.parse(removeInfo)).success(function (status) {

            console.log("Controller - AddRating Finished");

            $http({
                method: "GET",
                url: 'db_mastergamelist' + $rootScope.userLibrary
            }).success(function (libraryData) {
                console.log("Controller - remove results");

                $scope.removeResults = libraryData;
                console.log("removeResults - " + $scope.removeResults);

            });

        });

        $http({
            method: "GET",
            url: 'db_mastergamelist' + $rootScope.userLibrary
        }).success(function (libraryData) {
            console.log("Controller - library results");

            $scope.libraryResults = libraryData;
            console.log("libraryResults - " + $scope.libraryResults);

        });
    };
    $scope.findMyRating = function (MyData) {
        rating = 0;
        if (Object.keys(MyData).length > 0) {
            console.log("my_data - " + JSON.stringify(MyData));
            console.log("my_length - " + Object.keys(MyData).length);

            var sum = 0; for (var i = 0; i < Object.keys(MyData).length; i++) {
                if (MyData[i].User == $rootScope.userName) {
                    console.log("my_rating:" + MyData[i].Rating);
                    rating = MyData[i].Rating;
                };    
            };
        }; return rating;
    };


    $scope.calculateAverage = function (MyData) {
        if (Object.keys(MyData).length > 0) {
            console.log("avg_data - " + JSON.stringify(MyData));
            console.log("avg_length - " + Object.keys(MyData).length);

            var sum = 0; for (var i = 0; i < Object.keys(MyData).length; i++) {
                console.log("avg_value - " + MyData[i].Rating);
                sum += parseInt(MyData[i].Rating, 10);
            }; //don't forget to add the base
            
            var avg = sum / Object.keys(MyData).length;

            console.log("avg- " + avg);
            return avg;            
        };
    };

    


    $scope.redirectToBgg = function (gameUrl) {
        $window.location.href = ("https://boardgamegeek.com/boardgame/" + gameUrl);
    };

}]);