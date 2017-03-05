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

    $scope.LibraryName = $rootScope.userLibrary;
    $scope.Librarys = ['Cunningham', 'Lueders'];

    $scope.dropboxitemselected = function (item) {
        $scope.LibraryName = item;
    };

    $scope.openModal = function (gameName) {
        $scope.modalGameName = gameName;

    };


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


    //Date Picker Modal

    $scope.today = function() {
        $scope.dt = new Date();
    };

    $scope.today();

    $scope.clear = function() {
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

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
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

    

    $scope.logPlay = function (gameName, datePicked) {

        $scope.playerSelected($scope.player1, 1);

        console.log("+++++++++++++Log Play+++++++++++++++++++++");
        console.log("game-" + gameName);
        console.log("date-" + datePicked);
        console.log("array: " + $scope.players)
        console.log("++++++++++++++++++++++++++++++++++++++++++");

        

        for (i = 0; i < $scope.players.length; i++) {

            console.log("playerInfo - " + $scope.players[i]);

            playerInfo = '{ "GameID" : "' + gameName + '", "UserID" : "' + $scope.players[i] + '", "datePlayed" : "' + datePicked + '" }';

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

    $scope.playerSelected = function(player, number){    

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


    $scope.clearPlayers = function(){

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