
const crypto = require('crypto');

/*
1. Build Reports table when Botmode activated
*/

let makeReportsTable = function() {
	let reportsGET = new XMLHttpRequest();

	//reportsGET.open('GET', 'http://botnet.artificial.engineering:80/api/reports', true);
	reportsGET.open('GET', 'http://localhost:3000/api/tasks', true);
	reportsGET.responseType = 'json';
	reportsGET.setRequestHeader('Content-Type', 'application/json');
	reportsGET.setRequestHeader('Token', 'Manatees');
	reportsGET.onload = function() {

		let data = reportsGET.response;
		if (data !== null) {
			//          console.log(data); // Parsed JSON object
			let element = document.querySelector('#reports tbody');
			element.innerHTML = useDataReports(data);
		}
	};
	reportsGET.send(null);
};

setInterval('makeReportsTable()', 3000);

let useDataReports = function(data) {
	let code = data.map((val, index) => {
		let input = val.data.input;
		let output = val.data.output;
		let id = val.id;
		let type = val.type;
		let sync;

		if (output === null) {
			sync = 'NOT OK';
		} else {
			sync = 'OK';
		}
		return '<tr><td style="white-space:nowrap">' + id + '</td><td>' + type + '</td><td>' + input + '</td><td>' + output + '</td><td>' + sync + '</td></tr>';
	}).join('\n');
	return code;
};

let botmodeOn = false;

let toggleBotMode = function() {
	if (!botmodeOn) {
		botmodeOn = true;
	} else {
		botmodeOn = false;
	}
	botmode();
};

let botmode = function() {
	let botmodebutton = document.getElementById('starttoggle');
	let postIntervalId;
	if (botmodeOn) {
		makeReportsTable();
		console.log('botmode an');
		postIntervalId = setInterval('postNewTasktoReports()', 3000);
		botmodebutton.innerHTML = 'Stop Botmode';
		//crypterIntervalId = setInterval('cryptData()', 1500);
	} else {
		console.log('botmode aus');
		clearInterval(postIntervalId);
		botmodebutton.innerHTML = 'Start Botmode';
		//clearInterval(crypterIntervalId);
		//document.querySelector('#reports tbody').innerHTML = '<tr><td colspan=\'5\'>Bitte Botmode starten</td></tr>';
	}
};

let postNewTasktoReports = function() {

	let doppelt = false;
	let tasksGET = new XMLHttpRequest();
	//reportsGET.open('GET', 'http://botnet.artificial.engineering:80/api/tasks', true);
	tasksGET.open('GET', 'http://localhost:3000/api/tasks', true);
	tasksGET.responseType = 'json';
	tasksGET.setRequestHeader('Content-Type', 'application/json');
	//  reportsGET.setRequestHeader('Token', 'my-token-123');
	tasksGET.onload = function() {

		let dataTasks = tasksGET.response;
		if (dataTasks !== null) {

			let reportsGET = new XMLHttpRequest();
			reportsGET.open('GET', 'http://localhost:3000/api/reports', true);
			reportsGET.responseType = 'json';
			reportsGET.setRequestHeader('Content-Type', 'application/json');
			//  reportsGET.setRequestHeader('Token', 'my-token-123');
			reportsGET.onload = function() {

				let dataReports = reportsGET.response;

				if (dataReports !== null) {
					for (let i = 0; i < dataTasks.length; i++) {
						for (let j = 0; j < dataReports.length; j++) {
							if (dataTasks[i].id === dataReports[j].id) {
								doppelt = true;
							}
						}
						if (!doppelt) {
							if (dataTasks[i].data.output === null) {
								POSTRequestReports(dataTasks[i].id, dataTasks[i].data.input, dataTasks[i].type, dataTasks[i].data.output);
								break;
							} else {
								POSTRequestReports(dataTasks[i].id, dataTasks[i].data.input, dataTasks[i].type, dataTasks[i].data.output);
							}
						} else {
							doppelt = false;
						}
					}
				}
			};
			reportsGET.send(null);
		}
	};
	tasksGET.send(null);
};


/*
POST this shit
*/

let POSTRequestReports = function(ids, inputs, types, outputs) {
	let reportsPOST = new XMLHttpRequest();

	reportsPOST.open('POST', 'http://localhost:3000/api/reports', true);
	reportsPOST.responseType = 'json';
	reportsPOST.setRequestHeader('Content-Type', 'application/json');
	reportsPOST.setRequestHeader('Token', 'Manatees');

	let reportToSend = {
		id: ids,
		data: {
			input: inputs,
			output: null
		}
	};

	if (outputs === null) {
		//console.log('new computed');
		reportToSend.data.output = cryptermuell(inputs, types);
	} else {
		//console.log('output already present');
		reportToSend.data.output = outputs;
	}
	reportsPOST.send(JSON.stringify(reportToSend));
	setTimeout("makeReportsTable()", 500);
};

let cryptermuell = function(input, type) {

	let result;

	if (input !== null) {
		if (type !== null) {
			if (type === 'hash-md5') {
				let md5sum = crypto.createHash('md5');
				md5sum.update(input);
				result = md5sum.digest('hex');
			} else if (type === 'hash-sha256') {
				let sha256sum = crypto.createHash('sha256');
				sha256sum.update(input);
				result = sha256sum.digest('hex');
			} else if (type === 'crack-md5') {
				console.log('crack-md5 not supported');
				result = 'Cannot crack md5';
			} else {
				console.log('Wrong type');
				result = 'Type not Supported';
			}
		} else {
			console.log('No type defined');
			result = 'Type error';
		}
	} else {
		console.log('No input');
		result = 'No Input given';
	}
	return result;
};

setTimeout(makeReportsTable(), 2000);
