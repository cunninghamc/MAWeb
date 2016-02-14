var app = angular.module('MAapp', []);

app.controller('MACtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.loading = false;
    console.log("Controller - Start");
       
  
    $scope.Function_searchbgg = function () {
        $scope.$emit('LOAD');
        $http({
            method: "GET",
            url: '/searchbgg:' + $scope.searchString
        }).success(function (searchData) {
            console.log("Controller - search results");
            console.log("SearchString: " + $scope.searchString);

            $scope.searchResults = searchData;
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

