var express = require('express');
var fs = require('fs');

var app = express();
var app2 = express();

app.get('/', function (req, res) {
    //
    fs.readFile("C:\\Users\\martinvondermey\\Documents\\NetBeansProjects\\DisplayTemp\\package.json" , function(err,data)
{
    if(err)
        console.log(err);
    else
        console.log(data.toString());
     //res.send(data.toString());
     var max = 30;
     var min = 10;
     res.json({"temperatur" : Math.random() * (max - min) + min});
});
    //
 
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app2.use(express.static(__dirname + '/public'));
app2.listen(3001, function () {
  console.log('Example app2 listening on port 3001!');
});