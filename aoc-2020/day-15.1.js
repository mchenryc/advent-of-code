/*
  Notes:
  https://adventofcode.com/2020/day/15

*/

// different input this time - not a separate page. My input is last
const puzzleInputs = (`
0,3,6 436
1,3,2 1
2,1,3 10
1,2,3 27
2,3,1 78
3,2,1 438
3,1,2 1836
1,17,0,10,18,11,6
`)
  .split('\n')
  .filter(i => i.length)
  .map(input => input
    .split(' '))
  .map(([start, expected]) => ({
    start: start.split(',').map(Number),
    expected: expected && Number(expected),
  }))
;

puzzleInputs.forEach(p => solve(p.start, p.expected))


function solve(start, expected) {
  console.dir(start, {depth: null});
  const history = [...start];
  while (history.length < 2020) {
    const prevIdx = history.length - 1;
    const prev = history[prevIdx];
    const priorIdx = history.lastIndexOf(prev, prevIdx - 1);
    const age = priorIdx === -1 ? 0 : prevIdx - priorIdx;
    // console.log({prev, prevIndex, age})
    history.push(age);
  }
  let answer = history[history.length - 1];
  console.log({answer, expected, success: answer === expected, history})
}
