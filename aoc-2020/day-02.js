/*
  Notes:
  https://adventofcode.com/2020/day/2

  * Multiple failures on p2 - all failure to read fully, and pay-attention-to-details.
  * I find this very debuggable: finish the snippet w/ `result` and the full results
    is dumped, for inspection, w/ steps of each stage. Curious if this will be useful
    as challenges get harder
  * dangling semicolin? XD

*/

var input = document.body.innerText
  .split('\n')
  .filter(i => i.length);
console.log("records: ", input.length);

// part 1
var result = input
  .map(i => i.split(' '))
  .map(([req, c, input]) => {
    const [min, max] = req.split('-').map(Number);
    return {
      min, max,
      char: c[0],
      input
     };
   })
   .map(e => ({ ...e,
     count: (e.input.match(new RegExp(e.char, 'g')) || []).length,
   }))
   .filter(e => e.count >= e.min && e.count <= e.max)
  ;

result.length


// part 2
var result = input
  .map(i => i.split(' '))
  .map(([req, c, input]) => ({
    indexes: req.split('-').map(Number),
    char: c[0],
    input
   }))
   .map(e => ({ ...e,
     found: e.indexes.map(idx => e.input[idx-1])
   }))
   .map(e => ({ ...e,
     hits: e.found.map(c => c === e.char)
   }))
   .map(e => ({ ...e,
     valid: e.hits.filter(h => h).length === 1
   }))
   .filter(e => e.valid);
  ;

result.length

