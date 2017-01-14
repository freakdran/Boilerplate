/*
1. Build Tasks table when loading website
2. Refreshs Tasks table when needed
*/

let makeTaskTable = function() {
	let taskGET = new XMLHttpRequest();

	taskGET.open('GET', 'http://localhost:3000/api/tasks', true);
	taskGET.responseType = 'json';
	taskGET.setRequestHeader('Content-Type', 'application/json');
	taskGET.setRequestHeader('Token', 'Manatees');
	taskGET.onload = function() {

		let data = taskGET.response;
		if (data !== null) {
			//          console.log(data); // Parsed JSON object
			let element = document.querySelector('#tasks tbody');
			element.innerHTML = useDataTasks(data);
		}
	};
	taskGET.send(null);
};

makeTaskTable();

let useDataTasks = function(data) {
	let code = data.map((val, index) => {
		let input = val.data.input;
		let output = val.data.output;
		let id = val.id;
		let type = val.type;

		return '<tr><td style="white-space:nowrap">' + id + '</td><td>' + type + '</td><td>' + input + '</td><td>' + output + '</td></tr>';
	}).join('\n');
	return code;
};

/*
POST this shit
*/

let POSTRequestTask = function() {
	let taskPOST = new XMLHttpRequest();

	taskPOST.open('POST', 'http://localhost:3000/api/tasks', true);
	taskPOST.responseType = 'json';
	taskPOST.setRequestHeader('Content-Type', 'application/json');
	taskPOST.setRequestHeader('Token', 'Manatees');

	let taskToSend = {
		type: document.getElementById('type').value,
		data: {
			input: document.getElementById('taskInput').value
		}
	};
	taskPOST.send(JSON.stringify(taskToSend));
	setTimeout("makeTaskTable()", 500);

};

setInterval("makeTaskTable()", 10000);
