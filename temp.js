var express = require('express');
var fs = require('fs');
var http = require('http');
var network = require('network');
var wifi = require('node-wifi-scanner');
var bodyParser = require("body-parser");
//
var app = express();
var app2 = express();
var app3 = express();
var app4 = express();
var app5 = express();
var app6 = express();
//
app6.use(bodyParser.urlencoded({ extended: false }));
app6.use(bodyParser.json());

app.get('/', function (req, res) {
    //
     var max = 30;
     var min = 10;
     res.json({"temperature" : Math.random() * (max - min) + min});
});
//
app3.get('/', function (req, res) {
    //
    network.get_active_interface(function(err, obj) {
        res.send(obj);
    });
    
//
});
//
app4.get('/', function (req, res) {
    //
    network.get_interfaces_list(function(err, obj) {
        res.send(obj);
    });  
//
});
//
//
app5.get('/', function (req, res) {
// Scan networks 
wifi.scan(function(err, networks) {
    if (err) {
        console.log(err);
    } else {
        res.send(networks);
    }
});
//
});
//
app6.post('/login',function(req,res){
  console.log("Inside login");
  console.log(req.body);
  
  // Connect to a network 
  wifi.connect({ ssid : req.body.WifiSSID, password : req.body.WifiPassword }, function(err) {
    if (err) {
        console.log(err);
    }
    else console.log('Connected');
  });
  
  res.end("yes");
});
//
app.listen(3000, function () {
  console.log('Example app listening on port 3000! Return Temperature');
});
//
app2.get('/wifi.html', function (req, res) {
    //
    fs.readFile(__dirname + '/public/wifi.html' , function(err,data)
{
    if(err)
        console.log(err);
    else
        var msg = data.toString();
        //
        getWifiList( function (WifiList)
        {
        console.log(WifiList);
        var msg2 = msg.replace(/MYWIFI/,WifiList);
        res.send(msg2);
        });
    });
//
});
//
app2.get('/mystyle.css', function (req, res) {
    //
    fs.readFile(__dirname + '/public/mystyle.css' , function(err,data)
{
    if(err)
        console.log(err);
    else
        var msg = data.toString();
        res.setHeader('Content-type','text/css');
        console.log(msg);
        res.writeHead(200);
        res.end(msg);
    });
//
});
//

app2.get('/', function (req, res) {
    //
    fs.readFile(__dirname + '/public/index.html' , function(err,data)
{
    if(err)
        console.log(err);
    else
        var msg = data.toString();
        console.log("Get Temp");

        getTemperature( function (Temperatur)
        {
          
        console.log("Hier "+Temperatur);
               
        var msg2 = msg.replace(/{{CurrentTemperature}}/gi,parseFloat(Temperatur).toFixed(2));
        res.send(msg2);
        });
//
});
});

app2.listen(3001, function () {
  console.log('Example app2 listening on port 3001!');
});

app3.listen(3003, function () {
  console.log('Example app3 listening on port 3003!. Return available Network to connect');
});

app4.listen(3004, function () {
  console.log('Example app4 listening on port 3004!. Return available Network devices');
});

app5.listen(3005, function () {
  console.log('Example app5 listening on port 3005!. Return available Wifi devices');
});
//
app6.listen(3006, function () {
  console.log('Example app6 listening on port 3006!. Set Network devices');
});
//
function getWifiList(callback) {
console.log("Entering");
    return http.get({
        host: '127.0.0.1',
        port: 3005,
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
        console.log(body);
    // Data reception is done, do whatever with it!
            callback(body);
        });
    });
}
//
function getTemperature(callback) {
console.log("Entering");
    return http.get({
        host: '127.0.0.1',
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
            var Temperatur = parsed.temperature;
            callback(Temperatur);
        });
    });
    }