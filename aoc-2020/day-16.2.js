/*
  Notes:
  https://adventofcode.com/2020/day/16

  * inverted the logic to remove nearby invalid tickets
  * reminds me of sudoku - applying rules to winnow possibilities
  * fancy use of dynamic spread assignment to copy obj. without specific key

*/

// const expected = undefined;
// const puzzleInput = document.body.innerText;
const expected = 12*13;
// const puzzleInput = `
// departure class: 0-1 or 4-19
// row: 0-5 or 8-19
// departure seat: 0-13 or 16-19
//
// your ticket:
// 11,12,13
//
// nearby tickets:
// 3,9,18
// 15,1,5
// 5,14,9
// `;
// rearranged to trigger viable reducer
const puzzleInput = `
departure class: 0-1 or 4-19
row: 0-5 or 8-19
departure seat: 0-13 or 16-19

your ticket:
12,11,13

nearby tickets:
9,3,18
1,15,5
14,5,9
`;

const input = puzzleInput
  .split('\n')
  .filter(i => i.length) // ignore blanks
console.log("lines: ", input.length);

const RULES = 'rules';
const YOURS = 'your ticket';
const NEARBY = 'nearby tickets';
const FILTERING = 'filtering';
const SOLVING = 'solving';
const RESOLVING = 'resolving';

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
  if (!m) {
    if (state.mode === YOURS) {
      return { ...state, yours: parseTicket(line) };
    } else {
      return { ...state, nearby: [...state.nearby, parseTicket(line)] };
    }
  } else {
    const key = m[1];
    if ([YOURS, NEARBY].includes(key)) {
      return { ...state, mode: key };
    } else {
      return { ...state, rules: { ...state.rules, [key]: parseRanges(m[2]) } };
    }
  }
}

/** State wielding history tracker */
function historyTracking(originalReducer, prior) {
  const history = [...(prior && prior.history || [])];
  const reducer = (state, value, index, array) => {
    const next = originalReducer(state, value, index, array)
    history.push(next);
    return next;
  };
  return Object.defineProperty(reducer, 'history', {get: () => history});
}


function inRange(range) {
  return value => {
    return !(value < range.min || value > range.max);
  }
}
function hasValue(value) {
  return range => {
    return !(value < range.min || value > range.max);
  }
}

function filterNearbyValid(state) {
  return {...state,
    mode: FILTERING,
    nearby: state.nearby
      .filter(nearTicket => nearTicket
        .every(tValue => Object.values(state.rules) // every field match some field
          .some(ranges => ranges // any rule can match
            .some(range => // any range can match
              inRange(range)(tValue))))),
  };
}

function solveTicket(state, yourValue, i) {
  const validValues = state.nearby
    .map(nearTicket => nearTicket[i])
    .concat(yourValue);

  const viableRules = Object.entries(state.rules)
    .filter(([key, ranges]) => validValues
      .every(value => ranges.some(hasValue(value))))
    .map(([key, ranges]) => ({ key, ranges }));

  if (viableRules.length === 1) {
    const key = viableRules[0].key
    const { [key]: _, ...remainingRules } = state.rules
    console.log('resolving', key);
    return {
      ...state,
      rules: remainingRules,
      ticket: { ...state.ticket, [key]: yourValue },
      viableKeys: state.viableKeys,
    };
  } else {
    const viableKeys = [...state.viableKeys];
    viableKeys[i] = viableRules.map(rule => rule.key);
    return { ...state, viableKeys };
  }
}

function resolveViable(state, fieldViableKeys, i) {
  if (!fieldViableKeys) {
    return state;
  }

  const remainingKeys = fieldViableKeys.filter(k => state.rules.hasOwnProperty(k));
  if (remainingKeys.length === 1) {
    const key = remainingKeys[0]
    const { [key]: _, ...remainingRules } = state.rules
    console.log('resolving', key);
    const viableKeys = [...state.viableKeys];
    delete viableKeys[i];
    return {
      ...state,
      rules: remainingRules,
      ticket: { ...state.ticket, [key]: state.yours[i] },
      viableKeys,
    };
  } else {const viableKeys = [...state.viableKeys];
    viableKeys[i] = remainingKeys;
    return {
      ...state,
      viableKeys,
    };
  }
}

const inputReducer = historyTracking(handleLine);
const initialState = input.reduce(inputReducer, state0);

const readyState = filterNearbyValid(initialState);

const ticketReducer = historyTracking(solveTicket, inputReducer);
const easyState = readyState.yours.reduce(ticketReducer, {
  ...readyState,
  mode: SOLVING,
  ticket: {},
  viableKeys: new Array(initialState.yours.length).fill(null)
});

const viableReducer = historyTracking(resolveViable, ticketReducer);
let resolveState = { ...easyState, mode: RESOLVING };
while (resolveState.viableKeys.some(keys => keys && keys.length)) {
  resolveState = resolveState.viableKeys.reduce(viableReducer, resolveState);
  console.log(resolveState);
}

const finalState = resolveState;
const answer = Object.entries(finalState.ticket)
  .filter(([key, value]) => key.startsWith("departure"))
  .reduce((acc, [key,value]) => acc * value, 1)
const success = answer === expected;


console.dir({
  history: viableReducer.history,
  answer, expected, success, finalState
}, {depth: null});
