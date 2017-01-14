/*
1. Build Status table when loading website
2. Refreshs Status table when needed
*/

let makeStatusTable = function() {
	let statusGET = new XMLHttpRequest();

	//statusGET.open('GET', 'http://botnet.artificial.engineering:80/api/status', true);
	statusGET.open('GET', 'http://localhost:3000/api/status', true);
	statusGET.responseType = 'json';
	statusGET.setRequestHeader('Content-Type', 'application/json');
	//  statusGET.setRequestHeader('Token', 'my-token-123');
	statusGET.onload = function() {

		let data = statusGET.response;
		if (data !== null) {
			//          console.log(data); // Parsed JSON object
			let element = document.querySelector('#status tbody');
			element.innerHTML = useDataStatus(data);
		}
	};
	statusGET.send(null);
};

makeStatusTable();

let useDataStatus = function(data) {
	let code = data.map((val, index) => {
		let wlButton;
		if (val.workload === 0) {
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
		return '<tr><td>' + Object.values(val).join('</td><td>') + '</td><td>' + wlButton + '</td></tr>';
	}).join('\n');
	return code;
};

/*
POST this shit
*/

let POSTRequestStatus = function(ids, workload) {
	let statusPOST = new XMLHttpRequest();

	statusPOST.open('POST', 'http://localhost:3000/api/status', true);
	statusPOST.responseType = 'json';
	statusPOST.setRequestHeader('Content-Type', 'application/json');
	statusPOST.setRequestHeader('Token', 'Manatees');

	let statusToSend = {
		id: ids,
		status: null
	};

	if (workload === 0) {
		statusToSend.status = true;
	} else {
		statusToSend.status = false;
	}
	console.log(JSON.stringify(statusToSend));
	statusPOST.send(JSON.stringify(statusToSend));
	setTimeout("makeStatusTable()", 500);
};

setInterval("makeStatusTable()", 10000);
