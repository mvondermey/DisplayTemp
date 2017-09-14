/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const sqlite3 = require('sqlite3').verbose();


var db = new sqlite3.Database('data.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
      console.log("Done");
      console.log('Connected to the SQlite database.');
      CheckIfConfigurationTableExists(function(){
              console.log("Done Check");
  });
  });

function CheckIfConfigurationTableExists(Next){
    //
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
            return Next();
        }
      });
     });
    } else return Next();
    });   
    //
    console.log("Going out");
    //
}