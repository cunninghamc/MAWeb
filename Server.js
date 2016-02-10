

var express = require("express");
var app = express();

var parseString = require('xml2js').parseString;

var http = require('http');

app.use(express.static(__dirname + '/public'));

function xmlToJson(url, callback) {
    var req = http.get(url, function (res) {
        var xml = '';

        res.on('data', function (chunk) {
            xml += chunk;
        });

        res.on('error', function (e) {
            callback(e, null);
        });

        res.on('timeout', function (e) {
            callback(e, null);
        });

        res.on('end', function () {
            parseString(xml, function (err, result) {
                callback(null, result);
            });
        });
    });
};

app.get('/searchbgg:search', function (req, res) {
    
    console.log("Server - Searchbgg");
    var searchStr = req.params.search;

    var url = "http://www.boardgamegeek.com/xmlapi/search?search=" + searchStr;
    

    console.log(url);

    xmlToJson(url, function(err, data) {
        if (err) {
            // Handle this however you like
            return console.err(err);
        }

        // Do whatever you want with the data here
        // Following just pretty-prints the object
        console.log(JSON.stringify(data, null, 2));
        console.log("Server - Finished Search");

        res.json(data);

    }
    )
});

app.get('/searchgame:gameID', function (req, res) {

    console.log("Server - searchgame");
    var GameID = req.params.gameID;
    console.log(GameID);
    var url = "http://www.boardgamegeek.com/xmlapi/boardgame/" + GameID;

    console.log(url);

    xmlToJson(url, function (err, data) {
        if (err) {
            // Handle this however you like
            return console.err(err);
        }

        // Do whatever you want with the data here
        // Following just pretty-prints the object
        console.log(JSON.stringify(data, null, 2));
        console.log("Server - Finished Search");

        res.json(data);

    }
    )
});


app.listen(80);
console.log("Starting Web Server Port 80");