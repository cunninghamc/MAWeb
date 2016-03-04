var app = angular.module('MAapp', []);

app.controller('MACtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.loading = false;
    console.log("Controller - Start");
    $scope.imgUrl = '/images/MAGreen.png';
    
    $scope.loginScript = function (password) {
        console.log(password);

        switch (password) {

            case '123':
                $scope.imgUrl = '/images/MAWhite.png';

            case '321':
                $scope.imgUrl = '/images/MABlue.png';

                break;
        };



    };

}]);







  
    $scope.Function_searchbgg = function () {
        $scope.$emit('LOAD');
        $http({
            method: "GET",
            url: '/searchbgg' + $scope.searchString
        }).success(function (searchData) {
            console.log("Controller - search results");
            console.log("SearchString: " + $scope.searchString);

            $scope.searchResults = searchData;
            $scope.$emit('UNLOAD');
        });
    };
    

    $scope.AddToLibrary = function (gameData) {
        $scope.$emit('LOAD');
        console.log('Start - AddToLibrary')
        //console.log(gameData);
        var objectId = gameData.$.objectid;
        console.log(objectId);

        $http({
            method: "GET",
            url: '/db_find_game' + objectId
        }).success(function (result) {
            console.log("Controller - find game")
            console.log(result);

            if (result <= 0) {


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
$scope.$emit('UNLOAD');

        });



        
    };




    $scope.redirectToBgg = function (gameUrl) {
        $window.location.href = ("https://boardgamegeek.com/boardgame/" + gameUrl);
    };
    
    
}]);

app.controller('mainController', ['$scope', function ($scope) {
    $scope.$on('LOAD', function () { $scope.loading = true });
    $scope.$on('UNLOAD', function () { $scope.loading = false });
}]);

