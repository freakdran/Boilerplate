
//const crypto = require('crypto');

/*
1. Build Reports table when Botmode activated
*/
var makeReportsTable = function() {
  var reportsGET = new XMLHttpRequest();

  //reportsGET.open('GET', 'http://botnet.artificial.engineering:80/api/reports', true);
  reportsGET.open('GET', 'http://localhost:3000/api/tasks', true);
  reportsGET.responseType = 'json';
  reportsGET.setRequestHeader('Content-Type', 'application/json');
  //  reportsGET.setRequestHeader('Token', 'my-token-123');
  reportsGET.onload = function() {

    var data = reportsGET.response;
    if (data !== null) {
      //          console.log(data); // Parsed JSON object
      var element = document.querySelector('#reports tbody');
      element.innerHTML = useDataReports(data);
    }
  };
  reportsGET.send(null);
}
setInterval('makeReportsTable()', 3000);

var useDataReports = function(data) {
  var code = data.map((val, index) => {
    var input = val.data.input;
    var output = val.data.output;
    var id = val.id;
    var type = val.type;
    var sync;

    if(output === null){
      sync = 'NOT OK';
    } else {
      sync = 'OK';
    }
    return '<tr><td style="white-space:nowrap">' + id + '</td><td>' + type + '</td><td>' + input + '</td><td>' + output +'</td><td>' + sync + '</td></tr>';
  }).join('\n');
    return code;
};

var botmodeOn = false;

var toggleBotMode = function() {
  if(!botmodeOn) {
    botmodeOn = true;
  } else {
    botmodeOn = false;
  }
  botmode();
}

var botmode = function() {
  if(botmodeOn) {
    makeReportsTable();
    console.log('botmode an');
    postIntervalId = setInterval('postNewTasktoReports()', 3000);
    //crypterIntervalId = setInterval('cryptData()', 1500);
  } else {
    console.log('botmode aus');
    clearInterval(postIntervalId);
    //clearInterval(crypterIntervalId);
		//document.querySelector('#reports tbody').innerHTML = '<tr><td colspan=\'5\'>Bitte Botmode starten</td></tr>';
  }
}

var postNewTasktoReports = function() {

  var doppelt = false;
  var doppeltAt;
  var tasksGET = new XMLHttpRequest();
  //reportsGET.open('GET', 'http://botnet.artificial.engineering:80/api/tasks', true);
  tasksGET.open('GET', 'http://localhost:3000/api/tasks', true);
  tasksGET.responseType = 'json';
  tasksGET.setRequestHeader('Content-Type', 'application/json');
  //  reportsGET.setRequestHeader('Token', 'my-token-123');
  tasksGET.onload = function() {

    var dataTasks = tasksGET.response;
    if (dataTasks !== null) {

      var reportsGET = new XMLHttpRequest();
      reportsGET.open('GET', 'http://localhost:3000/api/reports', true);
      reportsGET.responseType = 'json';
      reportsGET.setRequestHeader('Content-Type', 'application/json');
      //  reportsGET.setRequestHeader('Token', 'my-token-123');
      reportsGET.onload = function() {

        var dataReports = reportsGET.response;

        if(dataReports !== null) {
          for(var i = 0; i < dataTasks.length; i++) {
            for(var j = 0; j < dataReports.length; j++) {
              if(dataTasks[i].id === dataReports[j].id) {
                doppelt = true;
              }
            }
            if(!doppelt) {
              if(dataTasks[i].data.output === null) {
                POSTRequestReports(dataTasks[i].id, dataTasks[i].data.input, dataTasks[i].type, dataTasks[i].data.output);
                break;
              } else {
                POSTRequestReports(dataTasks[i].id, dataTasks[i].data.input, dataTasks[i].type, dataTasks[i].data.output);
              }
            } else {
              doppelt = false;
            }
          }
        }
      };
      reportsGET.send(null);
    }
  };
  tasksGET.send(null);
};

//const crypto = require('crypto');

/*
POST this shit
*/
var POSTRequestReports = function(ids, inputs, types, outputs) {
  var reportsPOST = new XMLHttpRequest();

  reportsPOST.open('POST', 'http://localhost:3000/api/reports', true);
  reportsPOST.responseType = 'json';
  reportsPOST.setRequestHeader('Content-Type', 'application/json');
  //reportsPOST.setRequestHeader('Token', 'my-token-1337');

  var reportToSend = {
    id: ids,
    data: {
      input: inputs,
      output: null
    }
  };
	//  var newOUT = cryptData(ids, inputs, types);   //somehow not working
	//  console.log('newout' + newOUT);
	//  reportToSend.data.output = cryptData(ids, inputs, types);   //until here

  /*platzhalter für outputgenerierung*/
  if(outputs === null) {
    console.log('new computed');
    reportToSend.data.output = reverser(inputs, types);
  } else {
    console.log('output already present');
    reportToSend.data.output = outputs;
  }
  /*/platzhalter*/
  console.log('toesend ' + JSON.stringify(reportToSend));
  reportsPOST.send(JSON.stringify(reportToSend));
  setTimeout("makeReportsTable()", 500);
};

var reverser = function(inputs, types) {

  var outputs = '';

  for(var i = 0; i < inputs.length; i++) {
    outputs += inputs.charAt(inputs.length - i - 1);
  }
  outputs += ' ' + types;
  return outputs;
}
/*
var cryptermuell = function(toCrypt) {

  var input = toCrypt.input;
  var type = toCrypt.type;
  var result;

  if(input !== null) {
    if(type !== null) {
      if(type === 'hash-md5') {
        let md5sum = crypto.createHash('md5');
        md5sum.update(input);
        result = md5sum.digest();
        console.log(result.toString('hex'));
        console.log(result);
      } else if(type === 'hash-sha256') {
        let sha256sum = crypto.createHash('sha256');
        sha256sum.update(input);
        result = sha256sum.digest();
      } else if(type === 'crack-md5') {
        console.log('crack-md5 not supported')
        result = 'Cannot create output';
      } else {
        console.log('Wrong type');
        result = null;
      }
    } else {
      console.log('No type defined');
      result = null;
    }
  } else {
    console.log('No input');
    result = null;
  }

  return result;
}
*/






setTimeout(makeReportsTable(), 2000);
