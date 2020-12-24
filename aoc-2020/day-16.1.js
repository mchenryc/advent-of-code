/*
  Notes:
  https://adventofcode.com/2020/day/16

  * HOF historyTracking state reducer

*/

// const expected = undefined;
// const puzzleInput = document.body.innerText;
const expected = 71;
const puzzleInput = `
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
`

const input = puzzleInput
  .split('\n')
  .filter(i => i.length) // ignore blanks
console.log("lines: ", input.length);

const RULES = 'rules';
const YOURS = 'your ticket';
const NEARBY = 'nearby tickets';

const state0 = {
  mode: RULES,
  rules: {},
  yours: null,
  nearby: [],
};

const parseTicket = (line) => line.split(',').map(Number);
const parseRanges = (ranges) => ranges.split(' or ')
  .map(range => {
    const [min, max] = range.split('-').map(Number);
    return {min, max};
  });

function handleLine(state, line) {
  const m = line.match(/(.+):(?: (.+))?$/);
  // console.log('=== HANDLING', line, [...(m ? m : [])]);
  if (!m) {
    if (state.mode === YOURS) {
      // console.log('found yours: ', line);
      return { ...state, yours: parseTicket(line) };
    } else {
      // console.log('found nearby: ', line);
      return { ...state, nearby: [...state.nearby, parseTicket(line)] };
    }
  } else {
    const key = m[1];
    if ([YOURS, NEARBY].includes(key)) {
      // console.log('changing state: ', key);
      return { ...state, mode: key };
    } else {
      // console.log('found rule: ', line);
      return { ...state, rules: { ...state.rules, [key]: parseRanges(m[2]) } };
    }
  }
}

const STATE = Symbol('state'); // won't exist first time
const HISTORY = Symbol('history'); // won't exist first time
function historyTracking(reducer) {
  return (state, value) => {
    const next = reducer(state[STATE] || state, value)
    // console.dir(next, {depth: null});
    return { [STATE]: next, [HISTORY]: [...(state[HISTORY] || []), next] };
  }
}

const history = input
  .reduce(historyTracking(handleLine), state0)
const state = history[STATE];

const invalid = state.nearby
  .flatMap(nearTicket => nearTicket
    .filter(tValue => Object.values(state.rules) // must not match any field
      .every(rule => rule.every(range => { // must not match any range
        var v = tValue < range.min || tValue > range.max;
        console.log(tValue, v, range);
        return v;
      }))));
const sum = invalid.reduce((a, b) => a + b, 0);
const success = sum === expected;

console.dir({history:history[HISTORY],
  sum, success, invalid}, {depth: null});
