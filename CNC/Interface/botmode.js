

var testPoster = function() {
  console.log('tester activated');
  var cyPO = new XMLHttpRequest();
  cyPO.open('POST', 'http://localhost:3000/api/crypter', true);
//  cyPO.responseType = 'text';
  cyPO.setRequestHeader('Content-Type', 'application/json');

  var datts = {
    type: 'hash-md5',
    input: 'woot'
  }
  console.log(JSON.stringify(datts));
  cyPO.send(JSON.stringify(datts));
  console.log(cyPO.responseText);

  cyPO.onreadystatechange = function() {
    if(cyPO.readyState == XMLHttpRequest.DONE) {
      console.log(cyPO.responseText);

    }
  }
}

/*
1. Build Reports table when Botmode activated
*/
var makeReportsTable = function() {
  var reportsGET = new XMLHttpRequest();

  //reportsGET.open('GET', 'http://botnet.artificial.engineering:80/api/reports', true);
  reportsGET.open('GET', 'http://localhost:3000/api/reports', true);
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

var useDataReports = function(data) {
  var code = data.map((val, index) => {
    var input = val.data.input;
    var output = val.data.output;
    var id = val.id;
    var type = val.type;
    var sync;

    if(output === null){
      sync = 'not ok';
    } else {
      sync = 'ok';
    }
    console.log(sync);
    return '<tr><td style="white-space:nowrap">' + id + '</td><td>' + type + '</td><td>' + input + '</td><td>' + output +'</td><td>' + sync + '</td></tr>';
  }).join('\n');
    return code;
};


var botmodeOn = false;
var botmodeIntervalId;

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
    botmodeIntervalId = setInterval('makeReportsTable()', 5000);

    crypterIntervalId = setInterval('cryptData()', 1500);
  } else {
    console.log('botmode aus');
    clearInterval(botmodeIntervalId);
    clearInterval(crypterIntervalId);

    document.querySelector('#reports tbody').innerHTML = '<tr><td colspan=\'5\'>Bitte Botmode starten</td></tr>';
  }
}

var postNewTasktoReports = function() {
  for(var i = 0; i < tasks.length; i++) {
    for(var j = 0; j < reports.length; j++) {
      if(tasks[i].id !== reports[j].id) {
        POSTRequestReports(tasks[i].id, tasks[i].data.input, tasks[i].type);
      }
    }
  }
}

//const crypto = require('crypto');

var cryptData = function(ids, inputs, types) {

  var taskData;
  var newOutput;

  var tG = new XMLHttpRequest();
  tG.open('GET', 'http://localhost:3000/api/tasks', true);
  tG.responseType = 'json';
  tG.setRequestHeader('Content-Type', 'application/json');
  tG.onload = function() {
    taskData = tG.response;
    for(var i = 0; i < taskData.length; i++) {

  //    console.log(ids + ' ' + inputs + ' ' + types);
  //    console.log(taskData[i].id + ' ' + taskData[i].data.input + ' ' + taskData[i].type);

      if(taskData[i].id == ids && taskData[i].data.input == inputs && taskData[i].type == types) {
        var crypterPOST = new XMLHttpRequest();
        crypterPOST.open('POST', 'http://localhost:3000/api/crypter', true);
    //    crypterPOST.responseType = 'json';
        crypterPOST.setRequestHeader('Content-Type', 'application/json');

        var toCrypt = {
          type: null,
          input: inputs
        };

        if(types === 'hash-md5') {
          toCrypt.type = types;
          crypterPOST.send(JSON.stringify(toCrypt));
        } else if (types === 'hash-sha256') {
          toCrypt.type = types;
          crypterPOST.send(JSON.stringify(toCrypt));
        } else if (types === 'crack-md5'){
          newOutput = 'crack-md5 not supported';
        } else {
          console.log('Wrong type');
        }
        crypterPOST.onreadystatechange = function() {
          if(crypterPOST.readyState == XMLHttpRequest.DONE) {
            newOutput = crypterPOST.responseText;
            console.log(newOutput);
            return newOutput;
            console.log('noreturn');
/*
DIESES RETURN!!!
///////////////////////////////////////////////////////////////////////////
MUSS FUNKTIONIEREN!!!
*/
          }
        }
        //console.log('outer funkt ' + pree);
      } else {
        //  console.log('Data not matching');
      };
    };
  };
  tG.send(null);

  //console.log('crypter' + getTasksData());
}





/*
POST this shit
*/
var POSTRequestReports = function(ids, inputs, types) {
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
  var newOUT = cryptData(ids, inputs, types);
  console.log('newout' + newOUT);
  reportToSend.data.output = cryptData(ids, inputs, types);
  console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW');
  console.log('toesend ' + JSON.stringify(reportToSend));
  reportsPOST.send(JSON.stringify(reportToSend));
  setTimeout("makeReportsTable()", 500);
};

 //setInterval("makeReportsTable()",5000);
