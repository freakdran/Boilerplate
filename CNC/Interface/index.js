
let _navigate = function(id) {

	let element = document.querySelector('#' + id);
	if (element !== null) {
		element.className = 'active';
	}
	let menu = document.querySelector('#inputSelector');

	if (element.id === 'tasks') {
		menu.className = 'active';
	} else {
		menu.className = '';
	}

	let others = [].slice.call(document.querySelectorAll('section'));
	for (let i = 0; i < others.length; i++) {
		if (others[i] !== element) {
			others[i].className = '';
		}
	}
};
