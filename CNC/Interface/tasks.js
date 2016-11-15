
//NUR TEST

var useDataTasks = function(data) {
  data.forEach((element, i) => {

    var table = document.querySelector("#tasks table");
    var body = table.createTBody();
    var row = body.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = element.id;
    cell = row.insertCell(1);
    cell.innerHTML = element.type;
    cell = row.insertCell(2);
    cell.innerHTML = element.data.input;
    cell = row.insertCell(3);
    cell.innerHTML = element.data.output;


    /*console.log(element.id);
    console.log(element.ip);
    console.log(element.task);
    console.log(element.workload);
    */
  });
};


/*
RICHTIGER CODE!!! DON'T CHANGE!!!!!!!!!!!!
var useData = function(data) {
var code = data.map((val, index) => {
return '<tr><td>' + Object.values(val).join('</td><td>') + '</td></tr>';
}).join('\n');
return code;
};
*/


/*
var useDataTasks = function(data) {
var code = data.map((val, index) => {
return '<tr><td>' + Object.values(val).join('</td><td>') + '</td></tr>';
}).join('\n');
return code;
};
*/


var taskGET = new XMLHttpRequest();

taskGET.open('GET', 'http://botnet.artificial.engineering:80/api/Tasks', true);

taskGET.responseType = 'json';
taskGET.setRequestHeader('Content-Type', 'application/json');
taskGET.setRequestHeader('Token', 'my-token-123');

taskGET.onload = function() {

  var data = taskGET.response;
  if (data !== null) {
    console.log(data); // Parsed JSON object
    var element = document.querySelector('#tasks tbody');
    element.innerHTML = useDataTasks(data);
  }
};
taskGET.send(null);
