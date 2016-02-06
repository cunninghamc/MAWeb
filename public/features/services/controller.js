var app = angular.module('MAapp', []);
app.controller('MACtrl', function ($scope, $http) {
    var url = "https://www.boardgamegeek.com/xmlapi/search?search=Crossbows%20and%20Catapults"

    xmlToJson(url, function(err, data, $http) {
        if (err) {
            // Handle this however you like
            return console.err(err);
        }

        // Do whatever you want with the data here
        // Following just pretty-prints the object
        console.log(JSON.stringify(data, null, 2));
    });
});