/*
  Notes:
  https://adventofcode.com/2020/day/10

  * Tried 2^(count of consecutive singles). Works for small, not for large
  * Figured out the 'triangular number' progression (and learned it has a name)
  * using shorter var names in the history, to keep each on 1 line

*/

const expected = undefined;
const puzzleInput = document.body.innerText;

// const expected = 8;
// const puzzleInput = `
// 16
// 10
// 15
// 5
// 1
// 11
// 7
// 19
// 6
// 12
// 4
// `
// const expected = 19208;
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
const state0 = {j: outlet, cs: 0, dis: 1, diffs: {}};

const history = [...adapters, device]
  .sort((a,b) => a-b)
  .reduce((hist, jolts) => {
    const prev = hist[hist.length-1];
    const diff = jolts - prev.j;
    // const tcs = prev.tcs + (diff === 1 && prev.diff === 1); // lol: true == 1 - total consecutive singles
    const consecutiveSingles = diff === 1 ? prev.cs + 1 : 0;
    // 1 + Triangular Number of the (count of consecutive singles - 1)
    // 1 for both 0 & 1 consecutive singles
    const triangularFactor = 1 + (consecutiveSingles * (consecutiveSingles - 1) / 2);
    // only incorporate triFactor after number of consecutive singles is known
    const distinctCount = consecutiveSingles ? prev.dis : prev.dis * prev.tri;
    return [...hist, {
      j: jolts,
      diff,
      cs: consecutiveSingles,
      tri: triangularFactor,
      dis: distinctCount,
      diffs: {...prev.diffs, [diff]: (prev.diffs[diff] || 0) + 1},
    }];
  }, [state0]);

console.dir(history, {depth: null})

const state = history[history.length-1];

console.log('expected:', expected, 'result:', state.dis)
