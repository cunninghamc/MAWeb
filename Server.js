

var express = require("express");
var app = express();

var parseString = require('xml2js').parseString;

var http = require('http');

var S = require('string');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://server:27017/MAwebDB'

var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

//********************************************************************************************//

app.get('/loginSearch:loginStr', function (req, result) {

    console.log("Server - loginSearch");
    var userLogin = req.params.loginStr;

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);
            var collection = db.collection('UserList');
            collection.find({ 'User_Login': userLogin }).toArray(function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else if (res.length) {
                    userInfo = res;
                    console.log(userInfo);
                } else {
                    console.log('No User Found');
                    userInfo = [];
                };
                db.close();
                result.json(userInfo);
            });

        }

    });

});



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

function bggPullOutIds(url, callback) {

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
            
            
            var xmlArray = xml.split("</boardgame>");
            var idList = "";
            
            xmlArray.forEach(function (value) {
                
                idList = idList + S(value).between('objectid="', '"').s + ',';

                
            });
            //console.log(idList);
            callback(null, idList);
        }); 
    });
};


app.get('/searchbgg:search', function (req, res) {
    
    console.log("Server - Searchbgg");
    var searchStr = req.params.search;

    var url = "http://www.boardgamegeek.com/xmlapi/search?search=" + searchStr;
   
    console.log(url);
          

    bggPullOutIds(url, function (err, data) {
        if (err) {
            return console.err(err);
        }

        console.log("Server - bggPullOutIds");        
        //console.log(data);

        var bggSearchUrl = "http://www.boardgamegeek.com/xmlapi/boardgame/" + data;

        xmlToJson(bggSearchUrl, function (err, data) {
            if (err) {             
                return console.err(err);
            }

            console.log("Server - Finished bggSearch");

            res.json(data);

            //console.log(data);
        })
    })
});

app.get('/db_find_game_master:objectId', function (req, result) {

    var GameId = req.params.objectId;
    console.log('Start - find Game master');
    console.log('fgm-GameId: ' + GameId);
    
   
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {

            var numResults = 'false';

            console.log('fgm-Connected to', dbUrl);
            var collection = db.collection('MasterGameList');
            collection.find({ 'Game_ObjectId': GameId }).toArray(function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else if (res.length) {
                    console.log("fgm-MasterGameLibrary: " + res.length);
                    numResults = 'true';
                } else {
                    console.log('fgm-Game not found in Master Game list');
                };
                db.close();

                console.log("fgm.res-" + numResults);
                result.send(numResults);
            });
                
        }

    });
    




});

app.get('/db_find_game_library/:objectId/:libraryId', function (req, result) {

    var GameId = req.params.objectId;
    var LibraryId = req.params.libraryId;
    console.log('Start - find Game library');
    console.log('fgu-GameId: ' + GameId);
    console.log('fgu-LibraryId: ' + LibraryId);

    

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error: ' + err);
        } else {
            console.log('fgu-Connected to', dbUrl);
            var collection = db.collection('GameLibrarys');
            // 
        var numResults = 'false';
            var o_id = new mongodb.ObjectId(LibraryId);
            collection.find({ "_id" : o_id , "gameList" : GameId }).toArray(function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else if (res.length) {                   
                    console.log("fgu-UserGameLibrary: " + res.length);
                    numResults = 'true';
                } else {
                    console.log('fgu-Game not found in User Library List');
                };
                db.close();
                
                console.log("fgu.res-" + numResults);
                result.send(numResults);
            });

        }

    });





});
app.post('/db_insert_mastergamelist', function (req, res) {

    var GameData = req.body;
    console.log('Start - insert mastergamelist');
    console.log('imgl-GameData:' + GameData);



    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);

            var collection = db.collection('MasterGameList');

            collection.insert(GameData, function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('docs inserted');
                };

                db.close();

            });

        }
        res.end('1');

    });


});

app.post('/db_insert_gamelibrary', function (req, res) {

    var GameId = req.body.gameId;
    var LibraryId = req.body.libraryId;
   

    console.log('Start - insert usergamelibrary');
    console.log('iugl-GameId:' + GameId);
    console.log('iugl-LibraryId:' + LibraryId);

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);

            var collection = db.collection('GameLibrarys');
            var o_id = new mongodb.ObjectId(LibraryId);

            collection.update({ "_id": o_id }, { $push: { "gameList": GameId } }, function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('docs inserted');
                };

                db.close();

            });

        }
        res.end('1');

    });


});


app.listen(80);
console.log("Starting Web Server Port 80");