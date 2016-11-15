/*var fizz = function* () {
    let i = 0;
    while (++i) {
        var is_fizz = i % 3 === 0;
        if (is_fizz) {
            yield 'Fizz';
        } else {
            yield '' + i;
        }
    }
};


var generator = fizz();
for (let i = 0; i < 100; i++) {
    console.log(generator.next().value);
}
*/

var checker = function(that) {
  if(that.checked) {
    console.log("checked");
  } else {
    console.log("not checked");
  }
console.log(that.name);
}

var checker2 = function(that) {

that = document.getElementsByName('1');


  if(that[0].checked) {
    console.log("checked");
  } else {
    console.log("not checked");
  }
}
