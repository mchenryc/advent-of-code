/*
  Notes:
  https://adventofcode.com/2020/day/15

  * Same trick as prev problems: v2 is same as v1,
    just larger so that memory / time is a concern.
*/

// different input this time - not a separate page. My input is last
// const target = 2020;
const target = 30000000;
const puzzleInputs = (`
0,3,6 175594
1,3,2 2578
2,1,3 3544142
1,2,3 261214
2,3,1 6895259
3,2,1 18
3,1,2 362
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
  const history = start
    .slice(0, start.length - 1)
    .reduce((acc, n, i) => { acc.set(n, i+1); return acc; }, new Map())
  console.dir(start, {depth: null});

  let prev = start[history.size];
  console.log({prev, history})

  for (let n = start.length; n < target; n++) {
    const priorTurn = history.get(prev);
    const age = priorTurn == null ? 0 : n - priorTurn;
    // finally, put the prev in to be found later
    history.set(prev, n);
    // if (n < 20) console.log({n, prev, priorTurn, age, history});
    prev = age;
  }
  const answer = prev;
  console.log({answer, expected, success: answer === expected});
}
