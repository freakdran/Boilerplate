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

var cryptData = function() {

  var taskData;

  var tG = new XMLHttpRequest();
  tG.open('GET', 'http://localhost:3000/api/tasks', true);
  tG.responseType = 'json';
  tG.setRequestHeader('Content-Type', 'application/json');
  tG.onload = function() {
    taskData = tG.response;
    for(var i = 0; i < taskData.length; i++) {
      if(taskData[i].data.output === null) {
        console.log('data is null at id ' + taskData[i].id);
        break;
      } else {
        console.log('Data of id: ' + taskData[i].id + ' already computed');
      }
    };

  };
  console.log(taskData);
  tG.send(null);
  //console.log('crypter' + getTasksData());






}





/*
POST this shit
*/
var POSTRequestReports = function(ids, workload) {
  var reportsPOST = new XMLHttpRequest();

  reportsPOST.open('POST', 'http://localhost:3000/api/reports', true);
  reportsPOST.responseType = 'json';
  reportsPOST.setRequestHeader('Content-Type', 'application/json');
  //reportsPOST.setRequestHeader('Token', 'my-token-1337');

  var reportToSend = {
    id: ids,
    status: null
  };

  if(workload === 0) {
    reportToSend.status = true;
  } else {
    reportToSend.status = false;
  }
  console.log(JSON.stringify(reportToSend));
  reportsPOST.send(JSON.stringify(reportToSend));
  setTimeout("makeReportsTable()", 500);
};

 //setInterval("makeReportsTable()",5000);
