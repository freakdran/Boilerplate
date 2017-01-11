

const crypto = require('crypto');

/*
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
*/

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
    botmodeIntervalId = setInterval('makeReportsTable()', 3000);
    postIntervalId = setInterval('postNewTasktoReports()', 3000);
    //crypterIntervalId = setInterval('cryptData()', 1500);
  } else {
    console.log('botmode aus');
    clearInterval(botmodeIntervalId);
    clearInterval(postIntervalId);
    //clearInterval(crypterIntervalId);
    document.querySelector('#reports tbody').innerHTML = '<tr><td colspan=\'5\'>Bitte Botmode starten</td></tr>';
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
