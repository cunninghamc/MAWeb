

var express = require("express");
var app = express();

var parseString = require('xml2js').parseString;

var http = require('http');
var https = require('https');

var S = require('string');
//var assert = require('assert');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://localhost:27017/MAwebDB'

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
                    userInfo = JSON.parse('[{"_id":"0","User_Name":"","User_Color": "MAwhite.png","User_Library":"","User_Login": ""}]');
                };
                db.close();
                result.json(userInfo);
            });

        }

    });

});



function xmlToJson(url, callback) {
    var req = https.get(url, function (res) {
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
            //console.log(xml);
            parseString(xml, function (err, result) {
                callback(null, result);
            });
        });
    });
};

function bggPullOutIds(url, callback) {    

    var req = https.get(url, function (res) {
        var xml = '';

        res.on('data', function (chunk) {
            xml += chunk;
            //console.log("+chunk" - chunk);
        });

        res.on('error', function (e) {
            callback(e, null);
            console.log("error");
        });

        res.on('timeout', function (e) {
            callback(e, null);
            console.log("timeout");
        });

        res.on('end', function () {
            console.log("end");
            //console.log(xml);
            
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

    var url = "https://www.boardgamegeek.com/xmlapi/search?search=" + searchStr;

    console.log(url);
          
    bggPullOutIds(url, function (err, data) {
        if (err) {
            return console.err(err);
        }

        console.log("Server - bggPullOutIds");        
        console.log(data);

        var bggSearchUrl = "https://www.boardgamegeek.com/xmlapi/boardgame/" + data;

        xmlToJson(bggSearchUrl, function (err, data) {
            if (err) {             
                return console.err(err);
            }

            console.log("Server - Finished bggSearch");

            res.json(data);

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
                    console.log(res);
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

app.put('/db_update_mastergamelist:gameId', function (req, res) {

    var updateInfo = req.body;
    console.log('Start - update mastergamelist');
   
    

    var gameId = req.params.gameId;
    console.log('umgl-gameId : ' + gameId);
    var gameName = '{"Game_ObjectId" : "' + gameId + '"}';

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);
            var addString = "{ $addToSet : " + JSON.stringify(updateInfo) + " } ";
            var collection = db.collection('MasterGameList');
            console.log(JSON.stringify(updateInfo));
            console.log(gameId);

            collection.updateOne({ "Game_ObjectId" : gameId } , { $addToSet : updateInfo } , function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('docs update');
                };

                db.close();
                console.log('db close');
            });
        }
        res.end('Added');
     });
    
});

app.put('/db_update_masterwishlist', function (req, res) {

    var updateInfo = req.body;
    console.log('Start - update masterwishlist');

    console.log('req - ' + JSON.stringify(req.body));

    var gameId = "" + req.body.Game + "";
    var userId = req.body.User;
    var rating = req.body.Rate;

    console.log("wishlist - " + gameId + "~" + userId + "~" + rating);

    console.log('umwl-gameId : ' + gameId);
   // var gameName = '{"Game_ObjectId" : "' + gameId + '"}';

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);
            //var addString = "{ $addToSet : " + JSON.stringify(updateInfo) + " } ";
            var collection = db.collection('MasterGameList');
            //console.log(JSON.stringify(updateInfo));
            console.log("wishlist - " + gameId);

            

            //collection.findAndModify({ query: { "Game_ObjectId": gameId, "Game_Wishers": { "Wisher_Name": userId }, update: { "Game_Wishers": { "Wisher_Rating": rating } } } }, function (err, res) {
            collection.update({ "Game_ObjectId" : gameId , "Game_Wishers.Wisher_Name": userId } , { $set : { "Game_Wishers.$.Wisher_Rating" : rating } } , function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('docs update');
                };

                db.close();
                console.log('db close');
            });
        }
        res.end('Added');
    });

});



app.get('/db_mastergamelist:userId', function (req, res) {
    
    var userId = req.params.userId;
    console.log('Start - get mastergamelist');
    console.log('gmgl - ' + userId);
    
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);

            var collection = db.collection('MasterGameList');
            //var findStr = ' { "Game_Owners" : "' + userId + '"}' ;
            //var jsonFindStr = JSON.parse(findStr);
            //console.log('gmgl - ' + findStr);

            //collection.find(JSON.parse(findStr)).toArray(function (err, results) {
            collection.find().toArray(function (err, results) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('library Found');
                    console.log(results);
                    res.send(results);
                };

                db.close();

            });

        }
        //res.end('1');

    });


});

app.get('/db_masterwishlist:userId', function (req, res) {

    var userId = req.params.userId;
    console.log('Start - get mastergamelist');
    console.log('gmgl - ' + userId);

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);

            var collection = db.collection('MasterGameList');
            var findStr = ' { "Game_Wishers" : "' + userId + '"}';
            var jsonFindStr = JSON.parse(findStr);
            console.log('gmgl - ' + findStr);

            collection.find(JSON.parse(findStr)).toArray(function (err, results) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('wishlist Found');
                    console.log(results);
                    res.send(results);
                };

                db.close();

            });

        }
        //res.end('1');

    });


});
app.post('/db_insert_gameRating', function (req, res) {    

    var vars = req.body;
    //console.log('---Vars : ' + JSON.stringify(vars));
    console.log('---Vars_GameID : ' + vars.GameID);
    console.log('---Vars_UserID : ' + vars.UserID);
    console.log('---Vars_Rating : ' + vars.GameRating);

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);

            var collection = db.collection('MasterGameList');

            //"{ Game_ObjectId : 13 } , { $set: { Game_Rating: [{User: 33342325353, Rating: 5 }] }, {upsert:true}"

            //var inputStr = '{ "Game_Rating" : ' + JSON.stringify(RateData) + '}';
            var jsonData1 = '{ "Game_Rating.$.Rating" : ' + vars.GameRating + ' }';
            console.log("---JSON 1 :  " + jsonData1);

            collection.update({ "Game_ObjectId": vars.GameID, "Game_Rating.User": vars.UserID }, { $set: JSON.parse(jsonData1)}, false, function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('GameRating Updated');
                };                

            });

            var jsonData2 = '{ "Game_Rating" : { "User" : "' + vars.UserID + '" , "Rating" : ' + vars.GameRating + ' }}';
            console.log("---JSON 2 :  " + jsonData2);
            collection.update({ "Game_ObjectId": vars.GameID, "Game_Rating.User": { $ne: vars.UserID } }, { $addToSet: JSON.parse(jsonData2) }, false, function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('GameRating Added');
                };

                db.close();

            });

        }

        res.end('1');

    });


});


app.post('/db_remove_game', function (req, res) {
    
    var vars = req.body;
    
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);

            var collection = db.collection('MasterGameList');

            console.log('GameID: ' + vars.GameID);
            console.log('UserID: ' + vars.UserID);

            jsonvar = '{ "Game_Owners" : "' + vars.UserID + '" }';
            console.log('jsonvar: ' + jsonvar);

            collection.update({ "Game_ObjectId" : vars.GameID }, { $pull: JSON.parse(jsonvar) }, function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('Game Removed');
                };

                db.close();

            });

        }

        res.end('1');

    });


});

app.post('/db_remove_wish', function (req, res) {

    var vars = req.body;

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);

            var collection = db.collection('MasterGameList');

            console.log('GameID: ' + vars.GameID);
            console.log('UserID: ' + vars.UserID);

            //jsonvar = '{ "Game_Wishers" : "' + vars.UserID + '" }';
            //console.log('jsonvar: ' + jsonvar);

            //collection.update({ "Game_ObjectId" : gameId , "Game_Wishers.Wisher_Name": userId } , { $set : { "Game_Wishers.$.Wisher_Rating" : rating } } , function (err, res) {

            collection.update({"Game_ObjectId": vars.GameID}, { $pull: { "Game_Wishers":{  "Wisher_Name" : vars.UserID } }  }, function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('Wish Removed');
                };

                db.close();

            });

        }

        res.end('1');

    });


});

app.post('/db_wish_to_own', function (req, res) {

    var vars = req.body;

    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            console.log('error:' + err);
        } else {
            console.log('Connected to', dbUrl);

            var collection = db.collection('MasterGameList');

            console.log('GameID: ' + vars.GameID);
            console.log('UserID: ' + vars.UserID);
            console.log('LibraryID: ' + vars.LibraryID);

            

            collection.update({ "Game_ObjectId": vars.GameID }, { $pull: { "Game_Wishers": { "Wisher_Name": vars.UserID } } }, function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('Wish Removed');
                };

                

            });

            collection.update({ "Game_ObjectId": vars.GameID }, { $addToSet: { "Game_Owners":  vars.LibraryID } }, function (err, res) {
                if (err) {
                    console.log('error: ' & err);
                } else {
                    console.log('Owned Added');
                };



            });
db.close();
        }

        res.end('1');

    });


});

app.listen(80);
console.log("Starting Web Server Port 80");