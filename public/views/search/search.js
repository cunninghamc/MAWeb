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
            //console.log("SearchData: " + JSON.stringify(searchData));
            $scope.searchResults = searchData;
            $scope.loading = false;
        });
    };

    $scope.openModal = function (gameData,index) {
        console.log("openModal - " + JSON.stringify(gameData));
       
        $('#btnCheck' + index).click();
        console.log('Start - LogPlay')
        //console.log(gameData);
        var objectId = gameData.$.objectid;
        console.log(objectId);
       
        $http({
            method: "GET",
            url: '/db_find_game_master' + objectId
        }).success(function (result) {
            console.log("Controller - find game master");
            console.log(result);

            //console.log("Names:  " + JSON.stringify(gameData.name));

            var sum = 0; for (var i = 0; i < Object.keys(gameData.name).length; i++) {
                console.log("nameData: " + JSON.stringify(gameData.name[i]));

                if (gameData.name[i].$.primary) {

                    GameName = gameData.name[i]._;

                };

            };
            console.log("English Game Name:" + GameName);
            $scope.modalGameName = GameName;

            if (result == 'false') {

                var Game = '{';
                Game = Game + '"Game_Name": "' + GameName + '",';
                Game = Game + '"Game_ObjectId": "' + gameData.$.objectid + '",';
                Game = Game + '"Game_MinPlayers": "' + gameData.minplayers[0] + '",';
                Game = Game + '"Game_MaxPlayers": "' + gameData.maxplayers[0] + '",';
                Game = Game + '"Game_PlayTime": "' + gameData.playingtime[0] + '",';
                Game = Game + '"Game_Thumbnail": "' + gameData.thumbnail[0] + '",';
                Game = Game + '"Game_Owners": [],';
                Game = Game + '"Game_Wishers": [],';
                Game = Game + '"Game_Rating": [],';
                Game = Game + '"Game_Plays": []';
                Game = Game + '}';

                console.log(Game);

                var jsonGame = JSON.parse(Game);

                console.log(jsonGame);

                $http.post("/db_insert_mastergamelist", jsonGame).success(function (status) {

                    console.log("Controller - AddToLibrary Finished");

                });
            } else {

                console.log('LogPlay - Game Already in DB');
                  


            };

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
                ownersData = '"Game_Owners": ["' + $rootScope.userLibrary + '"],';
                wisherData = '"Game_Wishers": [],';

                updateData = '{"Game_Owners" : "' + $rootScope.userLibrary + '"}';
                break;
            case "WishListAdd":
                ownersData = '"Game_Owners": [],';
                wisherData = '"Game_Wishers": [{"Wisher_Name": "' + $rootScope.userName + '", "Wisher_Rating": "4-Interested"}],';

                updateData = '{"Game_Wishers" : {"Wisher_Name": "' + $rootScope.userName + '", "Wisher_Rating": "4-Interested"}}';
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

            //console.log("Names:  " + JSON.stringify(gameData.name));
            
            var sum = 0; for (var i = 0; i < Object.keys(gameData.name).length; i++) {
                console.log("nameData: " + JSON.stringify(gameData.name[i]));

                if (gameData.name[i].$.primary) {
                   
                    GameName = gameData.name[i]._;

                };
                    
            };
                console.log("English Game Name:" + GameName);
            if (result == 'false') {

                var Game = '{';
                Game = Game + '"Game_Name": "' + GameName + '",';
                Game = Game + '"Game_ObjectId": "' + gameData.$.objectid + '",';
                Game = Game + '"Game_MinPlayers": "' + gameData.minplayers[0] + '",';
                Game = Game + '"Game_MaxPlayers": "' + gameData.maxplayers[0] + '",';
                Game = Game + '"Game_PlayTime": "' + gameData.playingtime[0] + '",';
                Game = Game + '"Game_Thumbnail": "' + gameData.thumbnail[0] + '",';
                Game = Game + ownersData;
                Game = Game + wisherData;
                Game = Game + '"Game_Rating": [],';
                Game = Game + '"Game_Plays": []';
                Game = Game + '}';

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

    //Date Picker Modal

    $scope.today = function () {
        $scope.dt = new Date();
    };

    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: false
    };

    $scope.dateOptions = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    //function disabled(data) {
    //var date = data.date,
    //mode = data.mode;
    //return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    //};

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
      {
          date: tomorrow,
          status: 'full'
      },
      {
          date: afterTomorrow,
          status: 'partially'
      }
    ];

    function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };



    $scope.logPlay = function (NameOfGame, datePicked) {
        $scope.playerSelected($scope.player1, 1);

        console.log("+++++++++++++Log Play+++++++++++++++++++++");
        console.log("game-" + NameOfGame);
        console.log("date-" + datePicked);
        console.log("array: " + $scope.players)
        console.log("++++++++++++++++++++++++++++++++++++++++++");



        for (i = 0; i < $scope.players.length; i++) {

            console.log("playerInfo - " + $scope.players[i]);

            playerInfo = '{ "GameID" : "' + NameOfGame + '", "UserID" : "' + $scope.players[i] + '", "datePlayed" : "' + datePicked + '" }';

            $http.post("/db_insert_gamePlayed", JSON.parse(playerInfo)).success(function (status) {

                console.log("Controller - AddPlayed Finished");

            });

        };

        $scope.clearPlayers();
        $scope.players = [];
    };

    var playerCount = 0;

    $scope.playerList = ['Cameron', 'Bekah', 'Justin', 'Diane'];

    $scope.player1 = $rootScope.userName;

    $scope.players = [];

    $scope.playerSelected = function (player, number) {

        switch (number) {
            case 1:
                $scope.player1 = player;
                $scope.players[0] = player;
                break;
            case 2:
                $scope.player2 = player;
                $scope.players[1] = player;
                break;
            case 3:
                $scope.player3 = player;
                $scope.players[2] = player;
                break;
            case 4:
                $scope.player4 = player;
                $scope.players[3] = player;
                break;
            case 5:
                $scope.player5 = player;
                $scope.players[4] = player;
                break;
            case 6:
                $scope.player6 = player;
                $scope.players[5] = player;
                break;
            default:

        }

        //$scope.player = player;
    };


    $scope.showPlayer = function (number) {

        switch (number) {

            case 2:
                $scope.showPlayer2 = true;
                break;
            case 3:
                $scope.showPlayer3 = true;
                break;
            case 4:
                $scope.showPlayer4 = true;
                break;
            case 5:
                $scope.showPlayer5 = true;
                break;
            case 6:
                $scope.showPlayer6 = true;
                break;
            default:

        }


        //$scope.player = player;
    };


    $scope.clearPlayers = function () {

        $scope.showPlayer2 = false;
        $scope.player2 = "";
        $scope.showPlayer3 = false;
        $scope.player3 = "";
        $scope.showPlayer4 = false;
        $scope.player4 = "";
        $scope.showPlayer5 = false;
        $scope.player5 = "";
        $scope.showPlayer6 = false;
        $scope.player6 = "";

    };





    


}]);


