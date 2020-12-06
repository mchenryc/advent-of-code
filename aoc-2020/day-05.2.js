/*
  Notes:
  https://adventofcode.com/2020/day/5

  * Imperative first (for loop w/ break) then imperative

*/

var input = document.body.innerText
  .split('\n')
  // .filter((line, i) => i < 10)
  .filter(i => i.length);
console.log("lines: ", input.length);

var rowBit = (c) => c === 'F' ? 0 : 1;
var colBit = (c) => c === 'L' ? 0 : 1;
var shiftBit = (b, i) => (b << i);
var orBytes = (acc, bin) => (acc | bin) ;

var docs = input
  .map(doc => ({doc}))
  .map(r => {
    const arr = r.doc.split('');
    return ({...r,
      row: arr.slice(0,7).map(rowBit).reverse().map(shiftBit).reduce(orBytes),
      col: arr.slice(7,10).map(colBit).reverse().map(shiftBit).reduce(orBytes),
    })
  })
  .map(r => ({...r, seat: r.row * 8 + r.col}))

// find the first seat after an empty seat, subtracting 1 for the empty seat
var seat = docs.map(r => r.seat)
  .sort((a, b) => a - b)
  .find((s, i, a) => i>0 && a[i-1] !== s - 1)
  - 1;

console.log('seat', seat);

