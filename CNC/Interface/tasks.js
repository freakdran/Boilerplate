/*
//NUR TEST

var useData = function(data) {
  data.forEach((element, i) => {

    var table = document.querySelector("table");
        var body = table.createTBody();
        var row = body.insertRow(0);
        var cell = row.insertCell(0);
        cell.innerHTML = element.id;
        cell = row.insertCell(1);
        cell.innerHTML = element.ip;
        cell = row.insertCell(2);
        cell.innerHTML = element.workload;
        cell = row.insertCell(3);
        if(element.workload === 0) {
          cell.innerHTML = "inaktiv";
        } else {
          cell.innerHTML = "aktiv";
        }

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

var useData = function(data) {
  var code = data.map((val, index) => {
    return '<tr><td>' + Object.values(val).join('</td><td>') + '</td></tr>';
  }).join('\n');
  return code;
};

var task = new XMLHttpRequest();

task.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks');

task.responseType = 'json';
task.setRequestHeader('Content-Type', 'application/json');
task.setRequestHeader('Token', 'my-token-123');

task.onload = function() {

    var data = task.response;
    if (data !== null) {
        console.log(data); // Parsed JSON object
        var element = document.querySelector('#tasks tbody');
        element.innerHTML = useData(data);
    }
};

task.send(null);
