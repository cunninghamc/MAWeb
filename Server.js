

var express = require("express");
var app = express();

var parseString = require('xml2js').parseString;

var http = require('http');


app.use(express.static(__dirname + '/public'));

app.get('searchbgg', function (req, res) {
    
    console.log("Server - Searchbgg");
    var url = "https://www.boardgamegeek.com/xmlapi/search?search=Crossbows%20and%20Catapults"

    console.log(url);
    //xmlToJson(url, function(err, data) {
    //    if (err) {
    //        // Handle this however you like
    //        return console.err(err);
    //    }

    //    // Do whatever you want with the data here
    //    // Following just pretty-prints the object
    //    console.log(JSON.stringify(data, null, 2));

    //}
    });   


app.listen(3000);