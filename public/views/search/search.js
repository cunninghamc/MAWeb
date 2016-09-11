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


    $scope.AddToLibrary = function (reqType,gameData,index) {
        $('#btnCheck' + index).click();
        console.log('Start - AddToLibrary')
        //console.log(gameData);
        var objectId = gameData.$.objectid;
        console.log(objectId);
        var ownersData = "";
        var wisherData = "";
        var updateData = "";
        switch (reqType) {
            case "LibraryAdd":
                ownersData = '"Game_Owners": ["' + $rootScope.userID + '"],';
                wisherData = '"Game_Wishers": [],';

                updateData = '{"Game_Owners" : "' + $rootScope.userID + '"}';
                break;
            case "WishListAdd":
                ownersData = '"Game_Owners": [],';
                wisherData = '"Game_Wishers": ["' + $rootScope.userID + '"],';

                updateData = '{"Game_Wishers" : "' + $rootScope.userID + '"}';
                break;
            default:
                ownersData = '"Game_Owners": [],';
                wisherData = '"Game_Wishers": [],';
        };

        $http({
            method: "GET",
            url: '/db_find_game_master' + objectId 
        }).success(function (result) {
            console.log("Controller - find game master");
            console.log(result);

            if (result == 'false') {

                var Game = '{';
                Game = Game + '"Game_Name": "' + gameData.name[0]._ + '",';
                Game = Game + '"Game_ObjectId": "' + gameData.$.objectid + '",';
                Game = Game + '"Game_MinPlayers": "' + gameData.minplayers[0] + '",';
                Game = Game + '"Game_MaxPlayers": "' + gameData.maxplayers[0] + '",';
                Game = Game + '"Game_PlayTime": "' + gameData.playingtime[0] + '",';
                Game = Game + '"Game_Thumbnail": "' + gameData.thumbnail[0] + '",';
                Game = Game + ownersData;
                Game = Game + wisherData;
                Game = Game + '"Game_Rating": [],';
                Game = Game + '"Game_Plays": []}';

                console.log(Game);

                var jsonGame = JSON.parse(Game);

                console.log(jsonGame);

                $http.post("/db_insert_mastergamelist", jsonGame).success(function (status) {

                    console.log("Controller - AddToLibrary Finished");
                    
                });
            } else {
                
                console.log('Game Already in DB');
                console.log('Adding new owner');

                
                console.log(updateData);

                $http.put("/db_update_mastergamelist" + gameData.$.objectid, updateData).success(function (status) {

                    console.log("Controller - UpdateLibrary Finished");
                    console.log("status = " + status);
                    
             });

                
            };
           
        });

 

    };


    $scope.redirectToBgg = function (gameUrl) {
        $window.location.href = ("https://boardgamegeek.com/boardgame/" + gameUrl);
    };

   
}]);


