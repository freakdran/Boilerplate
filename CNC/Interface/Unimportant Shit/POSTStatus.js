
/*
var POSTRequestStatus = function() {
var statusPOST = new XMLHttpRequest();

statusPOST.open('POST', 'http://botnet.artificial.engineering:80/api/Status', true);

statusPOST.responseType = 'json';
statusPOST.setRequestHeader('Content-Type', 'application/json');
//taskPOST.setRequestHeader('Token', 'my-token-1337');

var statusToSend = {
  id: 2,
  status: false
};
statusPOST.send(JSON.stringify(statusToSend));
};
*/

var POSTRequestStatus = function(ids, workload) {
var statusPOST = new XMLHttpRequest();

statusPOST.open('POST', 'http://botnet.artificial.engineering:80/api/Status', true);

statusPOST.responseType = 'json';
statusPOST.setRequestHeader('Content-Type', 'application/json');
//taskPOST.setRequestHeader('Token', 'my-token-1337');

var statusToSend = {
  id: ids,
  status: null
};

if(workload === 0) {
  statusToSend.status = true;
} else {
  statusToSend.status = false;
}



statusPOST.send(JSON.stringify(statusToSend));


//sleep um zu warten bis server änderungen hat??
refreshStatusTable();
};

setInterval("refreshTable()",10000);
