
var _navigate = function(id) {

  var element = document.querySelector('#' + id);
  if (element !== null) {
    element.className = 'active';
  }
  var menu = document.querySelector('#inputSelector');

  if(element.id === 'tasks') {
    menu.className = 'active';
  } else {
    menu.className = '';
  }

  var others = [].slice.call(document.querySelectorAll('section'));
  for(var i = 0; i < others.length; i++) {
    if(others[i] !== element) {
      others[i].className = '';
    }
  }
};
