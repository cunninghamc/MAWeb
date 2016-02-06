

var express = require("express");
var app = express();

var parseString = require('xml2js').parseString;

var http = require('http');


app.use(express.static(__dirname + '/public'));




app.listen(3000);