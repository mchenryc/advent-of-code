/*
  Notes:
  https://adventofcode.com/2020/day/17

  * killed historyReducer for this one
  * Added jsdoc types, because linking in IDE is noice
  * Went full recursive, not surprisingly, the order of params
    reversed, to follow the nested order (instead of x,y,z,
    as when reading, params were passed z,y,x, as in data
    nesting), this felt much more consistent.

*/

// const expected = undefined;
// const puzzleInput = document.body.innerText;
// const stateIn = {
//   dimensions: 3,
// iterations: 6,
//   expected: 112,
// };
const stateIn = {
  dimensions: 4,
  iterations: 6,
  expected: 848,
};
const puzzleInput = `
.#.
..#
###
`;
// const puzzleInput = `
// ##..#.#.
// #####.##
// #######.
// #..#..#.
// #.#...##
// ..#....#
// ....#..#
// ..##.#..
// `;


const input = puzzleInput
  .split('\n')
  .filter(i => i.length) // ignore blanks
console.log("lines: ", input.length);

function tapper(reducer, tap) {
  return (state, value, index, array) => {
    const next = reducer(state, value, index, array);
    tap(next);
    return next;
  }
}

function repeat(n, action, state) {
  console.log('repeat',n);
  return n > 0 ? action(repeat(n-1, action, state), n) : state;
}

const ACTIVE = '#';
const INACTIVE = '.';

/** @typedef {{
 *   initial?: [any],
 *   data?: [any],
 *   dimensions: number,
 *   iterations: number,
 *   step: number,
 * }} State */
/** @type {State} */
const state0 = {
  initial: null,
  data: null,
  ...stateIn,
  step: 0,
};

/**
 * Expand hyperCube by 1 inactive cells on each side.
 * May be empty, but must be minimum 2 dimensional: [[]].
 */
function expandHyperCube(data, edge) {
  if (typeof data[0] === 'number') {
    return [0, ...(edge ? data.slice().fill(0) : data), 0];
  } else {
    return [
      expandHyperCube(data[0], true),
      ...data.map(d => expandHyperCube(d, edge)),
      expandHyperCube(data[0], true),
    ];
  }
}

/** 0 or 1 for un/occupied respectively */
function cellState(data, ...coords) {
  if (typeof data === 'number') {
    return data;
  } else {
    return cellState(data[coords[0]], ...coords.slice(1));
  }
}

/** Also counts target cell. */
function localCount(sum, data, ...coords) {
  const c0 = Math.max(0, coords[0]-1)
  const cN = Math.min(coords[0]+2, data.length);

  data = data.slice(c0, cN);
  // console.log('   coords', coords);
  // displayHyperCube(data)

  if (coords.length > 1) {
    return data.reduce((sum, datum) =>
      localCount(sum, datum, ...coords.slice(1)), sum);
  } else {
    return data.reduce((sum, cell) => sum + cell, sum);
  }
}

function nextCellState(data, ...coords) {
  const cell = cellState(data, ...coords);
  const local = localCount(0, data, ...coords) - cell;

  return ((cell && (local === 2 || local === 3))
    || (!cell && local === 3))
    ? 1 : 0;
}

function nextState(state) {
  const expanded = expandHyperCube(state.data);
  console.log('===Expanded');
  // displayHyperCube(expanded);

  function nextDimension(data, ...coords) {
    if (typeof data === 'number') {
      return nextCellState(expanded, ...coords);
    } else {
      return data.map((next, c) => nextDimension(next, ...coords, c));
    }
  }

  return {
    ...state,
    iterations: state.iterations + 1,
    data: nextDimension(expanded),
  }
}

function displayHyperCube(data, ...coords) {
  const pad = (n) => ('  '+n).slice(-2);
  const label = (...coords) => coords && coords.map(pad).join(',') || '';

  if (typeof data[0] === 'number') { // row
    console.log(data.reduce((line, c) => line + (c ? ACTIVE : INACTIVE), ''));
  } else if (typeof data[0][0] === 'number') { // square
    console.log(label(...coords));
    data.forEach((row, j) =>
      console.log(label(...coords, j), row.reduce((line, c) => line + (c ? ACTIVE : INACTIVE), '')));
  } else {
    data.forEach((datum, coord) => displayHyperCube(datum, ...(coords || []), coord))
  }
}

function activeCount(state) {
  function count(sum, data) {
    if (typeof data[0] === 'number') {
      return data.reduce((sum, cell) => sum + cell, sum);
    } else {
      return data.reduce(count, sum);
    }
  }
  return state.data && count(0, state.data);
}

/**
 ** @param state {State}
 */
function displayState(state) {
  const active = activeCount(state);
  console.log(`Iteration ${state.step}/${state.iterations}: (active: ${active})`);
  // displayHyperCube(state.initial);
  displayHyperCube(state.data);
}

function initialize(state) {
  function wrap(n, data) {
    return n > 2 ? wrap(n-1, [data]) : data;
  }
  return {
    ...state,
    data: wrap(state.dimensions, state.initial)
  }
}


/**
 * @param state {State}
 * @param line {string}
 */
function readLine(state, line) {
  return {
    ...state,
    initial: [
      ...(state.initial || []),
      line.split('').map(c => c === ACTIVE ? 1 : 0),
    ],
  }
}

let state = input.reduce(readLine, state0);
state = initialize(state);
displayState(state);

state = repeat(state.iterations, tapper(nextState, displayState), state);

// displayState(state);

const answer = activeCount(state);
const success = answer === state.expected;

console.dir({
  answer, expected: state.expected, success, iters: state.iterations,
}, {depth: null});
