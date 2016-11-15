var POSTRequestTask = function() {
var taskPOST = new XMLHttpRequest();

taskPOST.open('POST', 'http://botnet.artificial.engineering:80/api/Tasks', true);

taskPOST.responseType = 'json';
taskPOST.setRequestHeader('Content-Type', 'application/json');
//taskPOST.setRequestHeader('Token', 'my-token-1337');

var taskToSend = {
  type: document.getElementById('type').value,
  data: {
    input: document.getElementById('taskInput').value
  }
};
taskPOST.send(JSON.stringify(taskToSend));
};
