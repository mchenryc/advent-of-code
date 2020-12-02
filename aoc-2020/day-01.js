/*
  Notes:
  https://adventofcode.com/2020/day/1
  
  * clened up the formatting after it was... not well indented :)
  * vars are easier in chrome devtools
  * mmm, hard coded values in the middle of nested logic... ew.
  * output is... ugly, but vars w/ commas are so simple w/ console.log

*/

var input = document.body.innerText
  .split('\n')
  .filter(i => i.length);
console.log("records: ", input.length);

input = input.map(Number);

// part 1
for (i=0; i<input.length; i++) {
  var x=input[i]
  for(j=i; j<input.length; j++) {
    var y=input[j]
    if (x + y === 2020) {
      console.log(x, y, x+y)
    }
  }
}

// part 2
for (i=0; i<input.length; i++) {
  var x=input[i]
  for(j=i; j<input.length; j++) {
    var y=input[j]
    for(k=j; k<input.length; k++) {
      var z=input[k]
      if (x + y + z === 2020) {
        console.log(x, y, z, x+y+z, x*y*z)
      }
    }
  }
}
