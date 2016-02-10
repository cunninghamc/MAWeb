var app = angular.module('MAapp', []);

app.controller('MACtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
   
    console.log("Controller - Start");
       

    $scope.Function_searchbgg = function () {
        $http({
            method: "GET",
            url: '/searchbgg:' + $scope.searchString
        }).success(function (searchData) {
            console.log("Controller - search results");
            console.log("SearchString: " + $scope.searchString);

            $scope.searchResults = searchData;
        });
    };
    
   
    $scope.Function_searchgame = function (game) {
        $http({
            method: "GET",
            url: '/searchgame' + game
        }).success(function (gameData) {
            console.log("Controller - game results");
            console.log("bggGameId: " + game);
            console.log($scope.gameInfo)
            $scope.gameInfo = gameData;
            $scope.gameUrl = "https://boardgamegeek.com/boardgame/" + game;
            console.log($scope.gameInfo)
            console.log($scope.gameUrl)
        });

    }

    $scope.redirectToBgg = function () {
        $window.location.href = ($scope.gameUrl);
    };
}]);