var obj = { foo: 'bar' };
var fn  = function(a, b, c) {
    console.log(this, a, b, c);
};

var fn2  = function(a, b, c) {
    console.log(this, a, b, c);
}.bind(obj, "hooray");


var foo = fn.bind(obj, 1, 15, 4, 29);

/*
ruft fn2 auf und füllt mit "test" und 15 auf
dadurch ist
a = "hooray", siehe Zeile 8
b = "test"
c = 15

fn2.call ruft fn2 auf, gibt this (in diesem Fall Object)
a = hooray
b = 984654556
c = undefined, da C nicht gestgelegt in call oder bind.
*/
var lol = fn2("test", 15);
fn2.call(this, 984654556);

//foo(1, 2, 3);            // 1, 1, 2
//foo(1, 3, 4);            // 1, 2, 3

//foo.call(this,  1, 2, 3);     // obj, 1, 1, 2
//foo.apply(this, [ 1, 2, 3 ]); // obj, 1, 1, 2
// fn2.call(this, 1, 2, 3);
