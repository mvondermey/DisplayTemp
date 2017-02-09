var express = require('express');
var fs = require('fs');
var http = require('http');

var app = express();
var app2 = express();

app.get('/', function (req, res) {
    //
    fs.readFile("C:\\Users\\martinvondermey\\Documents\\NetBeansProjects\\DisplayTemp\\package.json" , function(err,data)
{
    if(err)
        console.log(err);
    else
        //console.log(data.toString());
     //res.send(data.toString());
     var max = 30;
     var min = 10;
     res.json({"temperature" : Math.random() * (max - min) + min});
});
    //
 
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

//app2.use(express.static(__dirname + '/public'));
app2.get('/', function (req, res) {
    //
    fs.readFile(__dirname + '/public/index.html' , function(err,data)
{
    if(err)
        console.log(err);
    else
        var msg = data.toString();
        console.log("Get Temp");

        var msg2 = msg.replace(/{{CurrentTemperature}}/gi,getTemperature());
        res.send(msg2);
//
});
});

app2.listen(3001, function () {
  console.log('Example app2 listening on port 3001!');
});

function getTemperature() {
console.log("Entering");
    return http.get({
        host: 'localhost',
        port: 3000,
        path: '/'
    }, function(response) {
        // Continuously update stream with data
        console.log("Entering2");
        var body = '';
        response.on('data', function(d) {
            console.log("Entering3");
            body += d;
        });
        response.on('end', function() {
            console.log("Entering4");
    // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            console.log(body);
            console.log("Entering5");
            console.log(parsed);
            console.log("Entering6");
            console.log(parsed.temperature);
            return parsed.temperature;
        });
    });
    }