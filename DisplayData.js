/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var fs = require('fs');

var app = express();

app.listen(3009, function () {
  console.log('app listening on port 3009!. Drawing diagrams');
});

app.get('/', function (req, res) {
    //
    fs.readFile(__dirname + '/public/drawing.html' , function(err,data){
        //
        var chartData = [];
        for (var i = 0; i < 7; i++)
            chartData.push(Math.random() * 50);
         //
        var msg = data.toString()
        var result = msg.replace('{{chartData}}', JSON.stringify(chartData));
        res.send(result);
        console.log(result);
        //
    });
    //
     //res.send("Here comes a drawing");
     //
});