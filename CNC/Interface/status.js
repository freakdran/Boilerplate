/*
1. Build Status table when loading website
2. Refreshs Status table when needed
*/
var makeStatusTable = function() {
  var statusGET = new XMLHttpRequest();

  statusGET.open('GET', 'http://botnet.artificial.engineering:80/api/status', true);
  statusGET.responseType = 'json';
  statusGET.setRequestHeader('Content-Type', 'application/json');
  statusGET.setRequestHeader('Token', 'my-token-123');
  statusGET.onload = function() {

    var data = statusGET.response;
    if (data !== null) {
      //          console.log(data); // Parsed JSON object
      var element = document.querySelector('#status tbody');
      element.innerHTML = useDataStatus(data);
    }
  };
  statusGET.send(null);
}

makeStatusTable();

var useDataStatus = function(data) {
  var code = data.map((val, index) => {
    var wlButton;
    if(val.workload === 0) {
      wlButton = '<label class="switch"> ' +
      '<input type="checkbox" onchange = "POSTRequestStatus(' + val.id + ', ' + val.workload + ')"> ' +
      '<div class="slider round"></div> ' +
      '</label>';
    } else {
      wlButton = '<label class="switch"> ' +
      '<input type="checkbox" onchange = "POSTRequestStatus(' + val.id + ', ' + val.workload + ')" checked> ' +
      '<div class="slider round"></div> ' +
      '</label>';
    }
    return '<tr><td>' + Object.values(val).join('</td><td>') + '</td><td>' + wlButton +'</td></tr>';
  }).join('\n');
  return code;
};

/*
POST this shit
*/
var POSTRequestStatus = function(ids, workload) {
  var statusPOST = new XMLHttpRequest();

  statusPOST.open('POST', 'http://botnet.artificial.engineering:80/api/Status', true);
  statusPOST.responseType = 'json';
  statusPOST.setRequestHeader('Content-Type', 'application/json');
  //statusPOST.setRequestHeader('Token', 'my-token-1337');

  var statusToSend = {
    id: ids,
    status: null
  };

  if(workload === 0) {
    statusToSend.status = true;
  } else {
    statusToSend.status = false;
  }
console.log(JSON.stringify(statusToSend));
  statusPOST.send(JSON.stringify(statusToSend));
  setTimeout("makeStatusTable()", 500);
};

//setInterval("makeStatusTable()",10000);
