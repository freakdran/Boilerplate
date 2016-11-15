var POSTRequestStatus = function() {
var taskPOST = new XMLHttpRequest();

taskPOST.open('POST', 'http://botnet.artificial.engineering:80/api/Status', true);

taskPOST.responseType = 'json';
taskPOST.setRequestHeader('Content-Type', 'application/json');
//taskPOST.setRequestHeader('Token', 'my-token-1337');

var statusToSend = {
  id: 4,
  status: false
};
taskPOST.send(JSON.stringify(statusToSend));
};
