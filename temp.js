//
var express = require('express');
var fs = require('fs');
var http = require('http');
var network = require('network');
//
// var wifi = require('iwlist')('wlan0');
//var wifi = require('node-wifi'); //Windows
//
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile');
const sqlite3 = require('sqlite3').verbose();
//
var file = 'data.json';
//
// Initialize wifi module 
// Absolutely necessary even to set interface to null 
//
//
  var Singleton = (function () {
    var instance;
 
    function createInstance() {
        var object = new Object("I am the instance");
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
//
var db = new sqlite3.Database('data.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
      console.log("Done");
      console.log('Connected to the SQlite database.');
  });
//
function SaveDataDB(from,msg,callback){
 //
    console.log("SaveDataDB");
 //
     let sql2 = `INSERT INTO CONFIGURATION
          VALUES('`+from+`', '`+msg+`' )`;
     db.run(sql2,function(err) {
         if (err) {
         console.log("err7 ");
           throw err;
        } else{ 
            console.log("inserted into configuration "+sql2);
  }
 //
});
}
//
function ReturnID(data){
    //
    console.log("ID "+data);
    return data;
    //
}
//
function GetDBID(callback){
    //
    myID = -10;
        console.log("GetDBID ");
          //
          //
            sql3 = `SELECT * FROM CONFIGURATION WHERE field='ID'; `;
            db.all(sql3, (err, rows) => {
                if (err) {
                    console.log("err2 ");
                    throw err;
                }
                rows.forEach(function (row) {
                    console.log("Value " + row.value);
                    myID = rows[0].value
                    console.log("End of getMyID " + myID);
                    callback(myID);  
                });
            });
    //

   console.log("GetDBID.out");
    //
}
//
//CheckIfConfigurationTableExists(GetDBID);
//
var app = express();
var app2 = express();
var app3 = express();
var app4 = express();
var app5 = express();
var app6 = express();
//
var app7 = express();
var port7 = 3700;
//
var app8 = express();
//var app9 = express();
//var app10 = express();
//
//console.log("Chat Server running on port="+port7);
//
// Create Chat Server
var io = require('socket.io').listen(app7.listen(port7),function(){
    console.log("Chat Server running on port="+port7);
}
);
//
io.sockets.on('connection', function (socket) {
    console.log('connection');
    socket.on('message', function (from, msg) {
        console.log('message', from, ' saying ', msg);
        SaveDataDB(from,msg);
    });
    //console.log("My ID="+GetDBID(ReturnID));
    GetDBID(function(myID){
        console.log("My ID="+myID);
    });
    //
    GetDBID(function(myID){
        socket.emit('message', myID, 'welcome to the chat' );
    });
    //
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});
//
app7.get("/", function(req, res){
    res.send("Chat running!");
});
//
//app9.get("/", function(req, res){
//    res.send("DisplayTemp!");
//});
//
//
var ioClient = require('socket.io-client');
//var socketClient = ioClient.connect('http://192.168.12.231:3700');
socketClient = ioClient.connect('http://localhost:3700');
// Add a connect listener
socketClient.on('connect', function (socket) {
    console.log('Connected!');
});
//
  socketClient.on('message', function (from, msg) {
    console.log('message', from, ' saying ', msg);
  });
  //
  (function loop() {
    getLocalDataJson(function(Data){
                GetDBID(function(myID){
                console.log("My ID="+myID+" Data "+Data);            
                socketClient.emit('message', myID, Data);
        });
    });
    setTimeout(loop, 5000);
  }());
//
//
app6.use(bodyParser.urlencoded({ extended: false }));
app6.use(bodyParser.json());
app2.use(bodyParser.urlencoded({ extended: false }));
app3.use(bodyParser.json());
//(app8.use(bodyParser.json());
app8.use(express.static('./'));
//
app8.get('/', function (req, res) {
   //
    //res.sendFile('./public/Chart.html', {root: './'});
    fs.readFile(__dirname + '/public/Chart.html' , function(err,data)
        {
    if(err)
        console.log(err);
    else
        var msg = data.toString();
        //
        getDBTemperatureArray ( function (tempArray)
        {
        console.log(tempArray);
        var msg2 = msg.replace(/DBDATA/,tempArray);
        //
        res.send(msg2);
        //
        });
    });
    
    //
});
//
app8.get('/temperatures', function (req, res) {
    //
     var max = 30;
     var min = 10;
     //
            sql3 = `SELECT * FROM CONFIGURATION where field != 'ID' ; `;
            db.all(sql3, (err, rows) => {
                if (err) {
                    console.log("err2 ");
                    throw err;
                }
                var aData = JSON.stringify(rows);
            
                //
                var jsonObj = JSON.parse(aData);
                //
                //console.log("Lenght "+aData.length);
                //
                var temperatures = "";
                for (s of jsonObj) {
                    console.log("Data1 "+JSON.stringify(s.value));
                    jsonDataObject = JSON.parse(s.value);
                    console.log("Data2 "+JSON.stringify(jsonDataObject.temperature));
                    //var temperature = JSON.parse(JSON.stringify(s.value)).replace(/\\/g, '').substring(1,aData.length-3);
                    var temperature = JSON.stringify(jsonDataObject.temperature);
                    temperatures = temperature + ","+temperatures; 
                    console.log(temperatures);
                }
                res.send(temperatures);
                //
                //rows.forEach(function (row) {
                //    console.log("Value " + row.value);
                //    myID = rows[0].value
                //    res.json({"MyData" : rows[1].value}); 
                //});
            });
     //
     //res.json({"Data" : Math.random() * (max - min) + min});
});
//
app8.get('/data', function (req, res) {
    //
     var max = 30;
     var min = 10;
     //
            sql3 = `SELECT * FROM CONFIGURATION where field != 'ID' ; `;
            db.all(sql3, (err, rows) => {
                if (err) {
                    console.log("err2 ");
                    throw err;
                }
                var aData = JSON.stringify(rows);
                res.send(aData);
                //
                //rows.forEach(function (row) {
                //    console.log("Value " + row.value);
                //    myID = rows[0].value
                //    res.json({"MyData" : rows[1].value}); 
                //});
            });
     //
     //res.json({"Data" : Math.random() * (max - min) + min});
});
//
//
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
app2.post('/',function(req,res){
    //
    console.log("Inside temperature");
    console.log(req.body);
    res.end();
    //
    jsonfile.writeFile(file, JSON.stringify(req.body), function(err) {
            //
            if(err)
                console.log(err);
     });      
    //
});
//
app.listen(3100, function () {
  console.log('Example app listening on port 3100! Return Temperature');
  
});
//
app2.use(express.static(__dirname + '/public/images'));
/*
app2.get('/Thermometer.png', function (req, res) {
    //
    fs.readFile(__dirname + '/public/Thermometer.png' , function(err,data)
{
    if(err)
        console.log(err);
    else
        var msg = data.toString();
        res.setHeader('Content-type','image/png');
        console.log(msg);
        res.writeHead(200);
        res.end(msg,'binary');
    });
//
});
*/
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
    //
{
    //
    getIPAddress( function (IPAddress)
    {
        console.log("IP Address "+IPAddress);
    }
 );
    //
    if(err)
        console.log(err);
    else
        var msg = data.toString();
        console.log("Get Temp");

        getTemperature( function (Temperatur)
        {
        console.log("Hier "+Temperatur);
            //
            jsonfile.readFile(file, function(err, obj) {
            //
            if(err){
                console.log(err);
                obj = JSON.stringify({ temperature1: '20' });
                if (err.code == 'ENOENT') jsonfile.writeFileSync(file, obj);
            } 
                //
                console.log("Obj "+obj);
                console.log(JSON.parse(obj));
                //
            var msg2 = msg.replace(/{{CurrentTemperature}}/gi,parseFloat(Temperatur).toFixed(2));
            var msg3 = msg2.replace(/{{TargetTemperature}}/gi,parseFloat(JSON.parse(obj).temperature1).toFixed(2));
            res.send(msg3);
            //
        });
        //
    });
//
});
});
//
app2.listen(3001, function () {
  console.log('Example app2 listening on port 3001!. Local Webpage');
});
//
app3.listen(3003, function () {
  console.log('Example app3 listening on port 3003!. Return available Network to connect');
});
//
app4.listen(3004, function () {
  console.log('Example app4 listening on port 3004!. Return available Network devices');
});
//
app6.listen(3006, function () {
  console.log('Example app6 listening on port 3006!. Set Network devices');
});
//
app8.listen(3008, function () {
  console.log('app8 listening on port 3008!. Return DB stored data');
});

//MvdM
//
//app9.listen(80, function () {
//  console.log('app9 listening on port 80!');
//});
//
//app10.listen(443, function () {
//  console.log('app10 listening on port 443!');
//});
//
function getIPAddress(callback){
    //
    var exec = require('child_process').exec;
    exec('hostname ', function(error, stdout, stderr) {
    console.log('stdout hostname : ' + stdout);
    if (error !== null) {
            console.log('exec error: ', error);
            console.log('stderr: ', stderr);
            callback(localhost);
    } else {
        var string1 = stdout.toString();
        var hostname = string1.trim();
        console.log('stdout hostname: ', stdout);
        //
        exec('ipconfig | findstr "IPv4" ', function(error, stdout, stderr) {
        console.log('stdout hostname2 : ', hostname);
        var words = stdout.toString().trim().split(" ");
        console.log("length: "+words.length);
        //
        var IPAddress = words[29];
        //
        if (error !== null) {
         console.log('exec error: ', error);
         console.log('stderr1: ', stderr);
         callback(localhost);
         }
         callback(IPAddress);
        });
        //
        }
  });
    //
}
//
function getTemperature(callback) {
console.log("Entering");
    return http.get({
        host: '127.0.0.1',
        port: 3100,
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
    //
    function getLocalDataJson(callback) {
    console.log("Entering");
    return http.get({
        host: '127.0.0.1',
        port: 3100,
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
            callback(body);
        });
    });
    }
    //
    function getDBDataJson(callback) {
    console.log("Entering");
    return http.get({
        host: '127.0.0.1',
        port: 3008,
        path: '/data'
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            callback(body);
        });
    });
    }
    //
    function getDBTemperatureArray(callback){
        //
               getDBDataJson ( function (DBData)
        {
             console.log(DBData);
             //
             var jsonObj = JSON.parse(DBData); 
                var temperatures = "";
                for (s of jsonObj) {
                    console.log("Data1 "+JSON.stringify(s.value));
                    jsonDataObject = JSON.parse(s.value);
                    console.log("Data2 "+JSON.stringify(jsonDataObject.temperature));
                    //var temperature = JSON.parse(JSON.stringify(s.value)).replace(/\\/g, '').substring(1,aData.length-3);
                    var temperature = JSON.stringify(jsonDataObject.temperature);
                    temperatures = temperature + ","+temperatures; 
                    console.log(temperatures);
                }
             //
             callback(temperatures);
        //
        });
        //
    }