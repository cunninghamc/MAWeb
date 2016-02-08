var app = angular.module('MAapp', []);
app.controller('MACtrl',['$scope', '$http', function ($scope, $http) {
    
    console.log("Controller - Start");

    $http.get('/searchbgg').success(function (response) {
        console.log("Controller - search results");

        $scope.searchresults = response;
    })

}]);