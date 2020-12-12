/*
  Notes:
  https://adventofcode.com/2020/day/10

*/

// const puzzleInput = document.body.innerText;
const puzzleInput = `
16
10
15
5
1
11
7
19
6
12
4
`
// const puzzleInput = `
// 28
// 33
// 18
// 42
// 31
// 14
// 46
// 20
// 48
// 47
// 24
// 23
// 49
// 45
// 19
// 38
// 39
// 11
// 1
// 32
// 25
// 35
// 8
// 17
// 7
// 9
// 4
// 2
// 34
// 10
// 3
// `

const input = puzzleInput
  .split('\n')
  .filter(i => i.length)
console.log("records: ", input.length);

const adapters = input
  .map(Number);
console.log('adapters:', adapters);

const outlet = 0;
const device = Math.max.apply(null, adapters) + 3
const state0 = {jolts: outlet, diffs: {}};

const history = [...adapters, device]
  .sort((a,b) => a-b)
  .reduce((hist, jolts) => {
    const prev = hist[hist.length-1];
    const diff = jolts - prev.jolts;
    return [...hist, {
      jolts,
      diffs: {...prev.diffs, [diff]: (prev.diffs[diff] || 0) + 1},
    }];
  }, [state0]);


console.dir({history}, {depth: null});

const state = history[history.length-1];

console.log('result:', state.diffs[1] * state.diffs[3])
