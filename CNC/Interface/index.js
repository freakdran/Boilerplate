
var _navigate = function(id) {

  var element = document.querySelector('#' + id);
  if (element !== null) {
    element.className = 'active';
  }

  //  var others = document.querySelector('section');

  var others = [].slice.call(document.querySelectorAll('section'));
  for(var i = 0; i < others.length; i++) {
    if(others[i] !== element) {
      others[i].className = '';
    }
  }

  //var otherso = others.map(  )








  //console.log(otherso);


  // TODO: query all other elements into Array
  // TODO: set className of others to ''

};
