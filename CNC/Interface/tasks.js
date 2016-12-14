/*
1. Build Tasks table when loading website
2. Refreshs Tasks table when needed
*/
var makeTaskTable = function() {
  var taskGET = new XMLHttpRequest();

  taskGET.open('GET', 'http://localhost:3000/api/tasks', true);
  taskGET.responseType = 'json';
  taskGET.setRequestHeader('Content-Type', 'application/json');
  //taskGET.setRequestHeader('Token', 'my-token-123');
  taskGET.onload = function() {

    var data = taskGET.response;
    if (data !== null) {
      //          console.log(data); // Parsed JSON object
      var element = document.querySelector('#tasks tbody');
      element.innerHTML = useDataTasks(data);
    }
  };
  taskGET.send(null);
}

makeTaskTable();

var useDataTasks = function(data) {
  var code = data.map((val, index) => {
    var input = val.data.input;
    var output = val.data.output;
    var id = val.id;
    var type = val.type;

    return '<tr><td style="white-space:nowrap">' + id + '</td><td>' + type + '</td><td>' + input + '</td><td>' + output +'</td></tr>';
  }).join('\n');
    return code;
};

/*
POST this shit
*/
var POSTRequestTask = function() {
  var taskPOST = new XMLHttpRequest();

  taskPOST.open('POST', 'http://localhost:3000/api/tasks', true);
  taskPOST.responseType = 'json';
  taskPOST.setRequestHeader('Content-Type', 'application/json');
  //taskPOST.setRequestHeader('Token', 'my-token-1337');

  var taskToSend = {
    type: document.getElementById('type').value,
    data: {
      input: document.getElementById('taskInput').value
    }
  };
  console.log(JSON.stringify(taskToSend));
  taskPOST.send(JSON.stringify(taskToSend));
  setTimeout("makeTaskTable()", 500);

};

setInterval("makeTaskTable()",10000);
