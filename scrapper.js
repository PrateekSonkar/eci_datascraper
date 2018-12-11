const request = require('request');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile')
const feedFile = './inputsource.json';


jsonfile.readFile(feedFile, function (err, obj) {
  if (err) {
    console.error(err)
  }
  else {
    //
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
          $(trelems).children().each(function(idx,tdrows){
            console.log("html l1 : ",$(tdrows).html())
            $(tdrows).children().each(function(ind,rows){
              console.log("html l2: ",ind," ",$(rows).html());
            });
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


