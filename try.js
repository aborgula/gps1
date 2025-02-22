//const prompt = require('prompt-sync')();

//var fname = prompt("enter name: ");

//console.log("name", fname);

const _ = require("lodash");

function mean(tablica) {
    return _.mean(tablica);
}

console.log(mean([2, 3, 3, 3, 4])); // Output: 3