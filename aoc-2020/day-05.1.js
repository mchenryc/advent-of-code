/*
  Notes:
  https://adventofcode.com/2020/day/5

  * First two submissions were on test data and first(10) :(
  *

*/

var input = document.body.innerText
  .split('\n')
  // .filter((line, i) => i < 10)
  .filter(i => i.length);
console.log("lines: ", input.length);

// input = [
//   'FFFFFFFLLL', // 0
//   'BBBBBBBRRR', // 1023
//   'BFFFBBFRRR', // row 70, column 7, seat ID 567.
//   'FFFBBBFRRR', // row 14, column 7, seat ID 119.
//   'BBFFBBFRLL', // row 102, column 4, seat ID 820.
// ]

var rowBit = (c) => c === 'F' ? 0 : 1;
var colBit = (c) => c === 'L' ? 0 : 1;
var shiftBit = (b, i) => (b << i);
var orBytes = (acc, bin) => (acc | bin) ;

var docs = input
  .map(doc => ({doc}))
  .map(r => {
    const arr = r.doc.split('');
    return ({...r,
      row: arr.slice(0,7),
      col: arr.slice(7,10),
    })
  })
  .map(r => ({...r,
    rBits: r.row.map(rowBit),
    cBits: r.col.map(colBit),
  }))
  .map(r => ({...r,
    rByte: r.rBits.reverse().map(shiftBit),
    cByte: r.cBits.reverse().map(shiftBit),
  }))
  .map(r => ({...r,
    rVal: r.rByte.reduce(orBytes),
    cVal: r.cByte.reduce(orBytes),
  }))
  .map(r => ({...r, seat: r.rVal * 8 + r.cVal}))

console.log('max', docs
  .reduce((max, r) => Math.max(max, r.seat), 0))

docs
