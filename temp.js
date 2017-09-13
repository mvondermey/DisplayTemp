//
var express = require('express');
var fs = require('fs');
var http = require('http');
var network = require('network');
// var wifi = require('iwlist')('wlan0');
var wifi = require('node-wifi'); //Windows
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile');
const sqlite3 = require('sqlite3').verbose();
//
var file = 'data.json';
//
// Initialize wifi module 
// Absolutely necessary even to set interface to null 
//
wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null 
});
//
var db = new sqlite3.Database('data.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
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
 var MyID = (function()
    {
//
// Query ID
//
    console.log("Inside getMyID");
    var myID = -1;
    var tableExist=0;
    //
    let sql = `SELECT COUNT(*) AS tableCount FROM sqlite_master WHERE type='table' AND name='CONFIGURATION';` ;
    //
    console.log(sql);
    //
    db.all(sql, [], (err, rows) => {
      //
      console.log("Inside3 getMyID");
      //
     if (err) {
      //
        console.log("Err1");
        throw err;
      //
      }
      //
      if ( rows[0].tableCount > 0 ) tableExist = 1;
      //
      console.log("*Table exists "+tableExist);
      //
      if( ! tableExist ){
      //
      const crypto = require("crypto");
     //
      const id = crypto.randomBytes(16).toString("hex");
      //
      console.log("Create table");
      // 
     db.run('CREATE TABLE CONFIGURATION(field text,value text)',function(err) {
        if(err){
            console.log("err3 ");
            throw err;
        } else console.log("Created table");  
    //
    let sql2 = `INSERT INTO CONFIGURATION
          VALUES('ID', '`+id+`' )`;
     db.run(sql2,function(err) {
         if (err) {
         console.log("err4 ");
           throw err;
        } else{ 
            console.log("inserted into configuration");
        }
      });
     });
    }
    });
   //
   return function(){
            //
            console.log("Return function");
            //
            if (tableExist==1) {
            //
            console.log("Query ID "+tableExist);
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
                });
            });
        } 
       //
       return myID;
   }
   //
   //
 })();
//

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
console.log("Chat Server running on port="+port7);

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
    console.log("My ID="+MyID());
    socket.emit('message', MyID(), 'welcome to the chat' );
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});
//
//
app7.get("/", function(req, res){
    res.send("Chat running!");
});
//
var ioClient = require('socket.io-client');
var socketClient = ioClient.connect('http://18.194.0.108:3700');
// Add a connect listener
socketClient.on('connect', function (socket) {
    console.log('Connected!');
});
//
  socketClient.on('message', function (from, msg) {
    console.log('message', from, ' saying ', msg);
  });
  //
    console.log("My ID="+MyID());
    getLocalDataJson(function(Data){
        socketClient.emit('message', MyID(), Data);
    });
//
//
app6.use(bodyParser.urlencoded({ extended: false }));
app6.use(bodyParser.json());
app2.use(bodyParser.urlencoded({ extended: false }));
app3.use(bodyParser.json());
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
//
app5.get('/', function (req, res) {
// Scan networks 
//
console.log("Scan wifi networks...");
//
//
wifi.scan(function(err, networks) {
    if (err) {
        console.log("Error ...");
        console.log(err);
        //res.send(err);
    } else {
        res.send(networks);
    }
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
app6.post('/login',function(req,res){
  console.log("Inside login");
  console.log(req.body);
  
  // Connect to a network 
  wifi.connect({ ssid : req.body.WifiSSID, password : req.body.WifiPassword }, function(err) {
    if (err) {
        console.log(err);
    }
    else console.log('Connected');
    //
  });
  //
  var exec = require('child_process').exec;
  exec('netsh wlan show interface | find /I " ssid" ', function(error, stdout, stderr) {
        console.log('stdout: ', stdout);
        var string1 = stdout.toString();
        var words = string1.replace(/ /g, "").split(":");
        console.log("length: "+words.length);
        var ssid = words[1];
        console.log("Connected to "+ssid);
        console.log('stderr: ', stderr);
  if (error !== null) {
        console.log('exec error: ', error);
  }
  });
  //
    var request = require('request');
    //
    //console.log("After require request");
    //
    request('http://localhost:3001/wifi.html', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log("Body ");
        //console.log(body) // Show the HTML for the Google homepage.
        res.send(body);
    } 
    else console.log(error);
    //
})
//
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
        //
        getIPAddress( function (IPAddress)
        {
            console.log(IPAddress);
            var msg3 = msg2.replace(/MYIP/g,IPAddress);
            res.send(msg3);
        }
        );
        //

        });
    });
//
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
function getIPAddress(callback){
    //
    var exec = require('child_process').exec;
    exec('hostname ', function(error, stdout, stderr) {
    if (error !== null) {
            console.log('exec error: ', error);
            console.log('stderr: ', stderr);
            callback(localhost);
    } else {
        var string1 = stdout.toString();
        var hostname = string1.trim();
        console.log('stdout: ', hostname);
        //
        exec('ipconfig | findstr "IPv4" ', function(error, stdout, stderr) {
        console.log('stdout: ', stdout);
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
    //
    function getLocalDataJson(callback) {
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
            callback(body);
        });
    });
    }
    