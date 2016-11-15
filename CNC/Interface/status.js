
//NUR TEST
/*var useDataStatus = function(data) {
  data.forEach((element, i) => {

    var table = document.querySelector("table");
        var body = table.createTBody();
        var row = body.insertRow(0);
        var cell = row.insertCell(0);
        cell.innerHTML = element.id;
        cell = row.insertCell(1);
        cell.innerHTML = element.ip;
        cell = row.insertCell(2);
        cell.innerHTML = element.task;
        cell = row.insertCell(3);
        cell.innerHTML = element.workload;


    console.log(element.id);
    console.log(element.ip);
    console.log(element.task);
    console.log(element.workload);
    });
};
*/
/*
RICHTIGER CODE!!! DON'T CHANGE!!!!!!!!!!!!
var useData = function(data) {
  var code = data.map((val, index) => {
    return '<tr><td>' + Object.values(val).join('</td><td>') + '</td></tr>';
  }).join('\n');
  return code;
};
*/

var useDataStatus = function(data) {
  var code = data.map((val, index) => {
    var wlButton;
    if(val.workload === 0) {
      wlButton = '<label class="switch"> ' +
        '<input type="checkbox"> ' +
        '<div class="slider round"></div> ' +
        '</label>';
    } else {
      wlButton = '<label class="switch"> ' +
        '<input type="checkbox" checked> ' +
        '<div class="slider round"></div> ' +
        '</label>';
    }
    return '<tr><td>' + Object.values(val).join('</td><td>') + '</td><td>' + wlButton +'</td></tr>';
  }).join('\n');
    return code;
};

var stat = new XMLHttpRequest();

stat.open('GET', 'http://botnet.artificial.engineering:80/api/status');

stat.responseType = 'json';
stat.setRequestHeader('Content-Type', 'application/json');
stat.setRequestHeader('Token', 'my-token-123');

stat.onload = function() {

    var data = stat.response;
    if (data !== null) {
        console.log(data); // Parsed JSON object
        var element = document.querySelector('#status tbody');
        element.innerHTML = useDataStatus(data);
    }
};

stat.send(null);
