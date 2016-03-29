angular.module('MAapp.search', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/views/search/', {
        templateUrl: 'views/search/search.html',
        controller: 'searchCtrl'
    });
}])

.controller('searchCtrl', ['$scope', '$http', '$window', '$location', '$rootScope', function ($scope, $http, $window, $location, $rootScope) {
    console.log('search active');
    $scope.loading = false;
    $scope.searchClicked = function () {
        console.log('search clicked');
        $location.path('/views/main/');

    };


    $scope.Function_searchbgg = function () {
        
        $http({
            method: "GET",
            url: '/searchbgg' + $scope.searchString 
        }).success(function (searchData) {
            console.log("Controller - search results");
            console.log("SearchString: " + $scope.searchString);

            $scope.searchResults = searchData;
            $scope.loading = false;
        });
    };


    $scope.AddToLibrary = function (gameData) {
        
        console.log('Start - AddToLibrary')
        //console.log(gameData);
        var objectId = gameData.$.objectid;
        console.log(objectId);

        $http({
            method: "GET",
            url: '/db_find_game_master' + objectId 
        }).success(function (result) {
            console.log("Controller - find game master");
            console.log(result.body);

            if (result == 'false') {

                var Game = '{';
                Game = Game + '"Game_Name": "' + gameData.name[0]._ + '",';
                Game = Game + '"Game_ObjectId": "' + gameData.$.objectid + '",';
                Game = Game + '"Game_MinPlayers": "' + gameData.minplayers[0] + '",';
                Game = Game + '"Game_MaxPlayers": "' + gameData.maxplayers[0] + '",';
                Game = Game + '"Game_PlayTime": "' + gameData.playingtime[0] + '",';
                Game = Game + '"Game_Thumbnail": "' + gameData.thumbnail[0] + '"}';

                console.log(Game);

                var jsonGame = JSON.parse(Game);

                console.log(jsonGame);

                $http.post("/db_insert_mastergamelist", jsonGame).success(function (status) {

                    console.log("Controller - AddToLibrary Finished");
                    
                });
            } else {
                console.log('Game Already in DB');
            };
           
        });

        $http({
            method: "GET",
            url: '/db_find_game_library/' + objectId + '/' + $rootScope.userLibrary
        }).success(function (result) {
            console.log("Controller - find game library")
            console.log(result);

            if (result == 'false') {
              
                   
                var Game = '{ "gameId" : "' + objectId + '","libraryId" : "' + $rootScope.userLibrary + '" }';

                console.log(Game);

                var jsonGame = JSON.parse(Game);

                console.log(jsonGame);

                $http.post('/db_insert_gameLibrary/', jsonGame ).success(function (status) {

                    console.log("Controller - AddToLibrary Finished");

                });
            } else {
                console.log('Game Already in library');
            };

        });

    };


    $scope.redirectToBgg = function (gameUrl) {
        $window.location.href = ("https://boardgamegeek.com/boardgame/" + gameUrl);
    };

   
}]);


