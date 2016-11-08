var arr = [ 1, 2, 3 ];
var foo = arr.map(function(val, index) {
    return Math.pow(val, 3);
});
var foo2 = foo.map(function(val, index) {
    return Math.pow(val, 2);
});


/*
pow syntax
val = wert der benutzt wird
int = exponent, spricht pow(2, 3) = 2*2*2
*/


var arr2 = [ 1, 2, 2, 1, 2, 2, 1, 3, 3, 1 ];
console.log(arr2);

for (var a = 0, al = arr.length; a < al; a++) {

    var val = arr[a];
    if (val === 2) {
        arr.splice(a, 1);
        al--;
        a--;
    }

}

console.log(arr2);
