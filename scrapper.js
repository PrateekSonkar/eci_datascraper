const request = require('request');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile')
const async = require('async');
const feedFile = './inputsource.json';
const wfile = './outputsource.json';
const objToWrite = [];

jsonfile.readFile(feedFile, function (err, obj) {
  if (err) {
    console.error(err)
  }
  else {
      async.eachOf(obj.stateinfo,function(value,key,callback){        
        let mappedItem = value.constituencyid.map(x =>({"statecode":value.statecode,"constituencyid":x}));
        console.log("Mapped ", mappedItem);
        async.eachOf(mappedItem,function(invalue,key,cb){          
          let url = `http://eciresults.nic.in/Constituencywise${invalue.statecode}${invalue.constituencyid}.htm?ac=${invalue.constituencyid}`;
          console.log("From Inner Loop : ", invalue, "\r\n", url);
          request(url, function (error, response, body) {
            if(error) {
              console.log('error:', error); // Print the error if one occurred            
            } else {
              const $ = cheerio.load(body);
              let table = $('#div1').children().first();
              $(table).children().each(function(i,trelems){
                let constituency = new Object();
                constituency["voteshare"] = [];          
                $(trelems).children().each(function(idx,tdrows){
                  //console.log("html l1 : ",idx,"  ",$(tdrows).html())            
                  let voteshare = new Object();
                  $(tdrows).children().each(function(ind,rows){              
                    if(idx == 0){
                      constituency["constituency"] = $(rows).text().trim();
                    }
                    if(idx > 2){
                      if(ind === 0){
                        voteshare["candidate"] = $(rows).text();
                        voteshare["constituency"] = constituency.constituency;
                      } 
                      else if(ind === 1){
                        voteshare["party"] = $(rows).text();
                      }
                      else if(ind === 2){
                        voteshare["votes"] = $(rows).text();
                      }                                
                    }              
                    
                  });                  
                  //objToWrite.push(voteshare);
                  jsonfile.writeFile(wfile, voteshare, { flag: 'a' }, function (err) {
                    if (err) console.error(err)
                  })
                  //console.log('*******\r\n',objToWrite,"\r\n*******");
                });
                console.log("in each : ",i," ==> ", $(trelems).children().length);
              })
            }
          });
          cb();
        },function(err){
          if(err) console.log(err);          
        })
        callback();
      },function(err){
        if(err) console.log(err);
        console.log('*******\r\n',objToWrite,"\r\n*******");
      });
      //console.log("MAP : ", obj.stateinfo[noOfStates].constituencyid.map(x =>({"statecode":obj.stateinfo[noOfStates].statecode,"constituencyid":x}) ))
      
    



    //
    /*  
    let url = 'http://eciresults.nic.in/ConstituencywiseS2679.htm?ac=79';
    request(url, function (error, response, body) {
      if(error) {
        console.log('error:', error); // Print the error if one occurred            
      } else {
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received  
        const $ = cheerio.load(body);
        let table = $('#div1').children().first();
        //console.log("Level 1 \r\n",$(table).children());
        $(table).children().each(function(i,trelems){
          let constituency = new Object();
          constituency["voteshare"] = [];          
          $(trelems).children().each(function(idx,tdrows){
            console.log("html l1 : ",idx,"  ",$(tdrows).html())            
            let voteshare = new Object();
            $(tdrows).children().each(function(ind,rows){              
              if(idx == 0){
                constituency["constituency"] = $(rows).text().trim();
              }
              if(idx > 2){
                if(ind === 0){
                  voteshare["candidate"] = $(rows).text();
                  voteshare["constituency"] = constituency.constituency;
                } 
                else if(ind === 1){
                  voteshare["party"] = $(rows).text();
                }
                else if(ind === 2){
                  voteshare["votes"] = $(rows).text();
                }                                
              }              
              console.log("html l2: ",ind," ",$(rows).text());              
            });
            console.log("voteshare :", voteshare);
            //constituency["voteshare"] = constituency["voteshare"].concat(voteshare);
            //console.log("Object : ", constituency);
            objToWrite.concat(voteshare);
            console.log('\r\n');
          });
          console.log("in each : ",i," ==> ", $(trelems).children().length);
        })
        //console.log("Level 2 \r\n",$('#div1').children().filter("tr").length);
        console.log('\r\n');
      }          
      //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //console.log('body:', body); // Print the HTML for the Google homepage.  
    });
    //
    */
    /*for (let noOfStates = 0 ; noOfStates < obj.stateinfo.length; noOfStates ++){
      console.log("State code : ", obj.stateinfo[noOfStates].statecode);
      console.log("State name : ", obj.stateinfo[noOfStates].statename);
      for (let consty = 0 ; consty < obj.stateinfo[noOfStates].constituencyid.length; consty++){
        //let url = `http://eciresults.nic.in/Constituencywise${obj.stateinfo[noOfStates].statecode}${obj.stateinfo[noOfStates].constituencyid[consty]}.htm?ac=${obj.stateinfo[noOfStates].constituencyid[consty]}`;
        let url = 'http://eciresults.nic.in/ConstituencywiseS2679.htm?ac=79';
        request(url, function (error, response, body) {
          if(error) {
            console.log('error:', error); // Print the error if one occurred            
          } else {
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received  
            const $ = cheerio.load(body);
            let table = $('#div1').children().first();
            //console.log("Level 1 \r\n",$(table).children());
            $(table).children().each(function(i,elems){
              console.log("in each : ",i," ==> ", $(elems).children().length)
            })
            //console.log("Level 2 \r\n",$('#div1').children().filter("tr").length);
            console.log('\r\n');
          }          
          //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          //console.log('body:', body); // Print the HTML for the Google homepage.  
        });
      }
    }   */
    
  } 
});


