var fizz = function* () {
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
