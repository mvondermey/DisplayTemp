/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// var wifi = require('iwlist')('wlan0');
var wifi = require('node-wifi'); //Windows
//var wifi = require('node-wifi'); //Windows

wifi.init({
    iface : null // network interface, choose a random wifi interface if set to null 
});

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

    app5.listen(3005, function () {
        console.log('Example app5 listening on port 3005!. Return available Wifi devices');
      });

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