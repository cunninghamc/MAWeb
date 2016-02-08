var app = angular.module('MAapp', []);
app.controller('MACtrl',['$scope', '$http', function ($scope, $http) {
    
    console.log("Controller - Start");
    $scope.myFunction = function() {
        $http({
            method: "GET",
            url: '/searchbgg:' + $scope.searchString            
        }).success(function (data) {
        console.log("Controller - search results");

        $scope.searchResults = data;
    })
}
}]);