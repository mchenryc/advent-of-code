/*
  Notes:
  https://adventofcode.com/2020/day/17

  * _Another_ Conway?
  * Futzing w/ the historyReduce, though didn't even use it for debugging
    Don't really like it. Either it holds state w/in (see #16),
    or keeps it's own state (as here, also see ...earlier days).
  * Initial problem getting to example answer was because I iterated
    the state cube, but hadn't expanded it enough. Suspected w/out
    proof, and implemented the 'expandMatrix()', done before each. If memory
    on part 2 becomes an issue, may need a 'trimMatrix()' after each step.
  * Also - seeing console.log statements interleaved for some reason, as though
    previous line buffer is interrupted w/ next, or node is just arbitrarly
    truncating output for unknown reason. Non-deterministic.

*/

// const expected = undefined;
// const puzzleInput = document.body.innerText;
const expected = 112;
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

/** State wielding history tracker - an HOF function w/ 'history' property. */
function historyReduce(reducer) {
  return (prior, value, index, array) => ({
    history: (prior && (prior.state && [...(prior.history || []), prior.state]) || [...(prior.history || [])]) || [],
    state: reducer(prior.state, value, index, array),
  });
}

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

const state0 = {
  /** type: number[number[number[]]] */
  cube: null,
  iterations: 6,
};

/**
 * Expand cube by 1 inactive cells on each side.
 * Cube may be empty, but must be 3 dimensional: [[[]]].
 */
function expandCube(cube) {
  const emptyRow = () => new Array(cube[0][0].length + 2).fill(0);
  const emptySquare = () => new Array(cube[0].length + 2).fill(0).map(emptyRow);
  return [
    emptySquare(),
    ...cube.map(square => [
      emptyRow(),
      ...square.map(row => [0, ...row, 0]),
      emptyRow(),
    ]),
    emptySquare(),
  ];
}

/** 0 or 1 for un/occupied respectively */
function cellState(cube, x, y, z) {
  const square = cube[z];
  const row = square && square[y];
  return row && row[x];
}

function nextCellState(cube, x, y, z) {
  const x0 = Math.max(0, x-1);
  const y0 = Math.max(0, y-1);
  const z0 = Math.max(0, z-1);
  const xN = Math.min(x+2, cube[0][0].length);
  const yN = Math.min(y+2, cube[0].length);
  const zN = Math.min(z+2, cube.length);
  const cell = cellState(cube, x, y, z);

  let local = 0;
  for (let k = z0; k < zN; k++) {
    for (let j = y0; j < yN; j++) {
      for (let i = x0; i < xN; i++) {
        if (!(i === x && j === y && k === z)) {
          local += cellState(cube, i, j, k);
        }
      }
    }
  }
  const next = ((cell && (local === 2 || local === 3))
    || (!cell && local === 3))
    ? 1 : 0;
  console.log(`  : [${z},${y},${x}]: C=${cell} L=${local} => ${next ? ACTIVE : INACTIVE}`);
  return next;
}

function nextState(state, i) {
  const expanded = expandCube(state.cube);
  console.log('===Expanded');
  displayCube(expanded);
  return {
    ...state,
    step: i,
    cube: expanded
      .map((square, z, cube) =>
        square.map((row, y) =>
          row.map((cell, x) =>
            nextCellState(cube, x, y, z)))),
  }
}

function displayCube(cube) {
  const pad = (n) => ('00'+n).slice(-2);
  cube.forEach((square, k) => {
    console.log(pad(k))
    square.forEach((row, j) =>
      console.log(pad(k), pad(j), row.reduce((line, i) => line + (i ? ACTIVE : INACTIVE), '')));
  });
}

function activeCount(cube) {
  return cube
    .reduce((sum, square) => square
      .reduce((sum, row) => row
        .reduce((sum, cell) => sum + cell,
          sum), sum), 0);
}

function displayState(state) {
  console.log(`Iteration ${state.step}/${state.iterations}: (${activeCount(state.cube)})`);
  displayCube(state.cube);
}

function readLine(state, line) {
  const initSquare = (s) => ( s.cube || [[]] )[0];
  return {
    ...state,
    cube: [[
      ...initSquare(state),
      line.split('').map(c => c === ACTIVE ? 1 : 0)
    ]],
  }
}

// let reducer = historyTracking(handleLine);
let state = input.reduce(readLine, state0);
displayState(state);

// displayState({cube: expandCube(state.cube)});

state = repeat(state.iterations, historyReduce(tapper(nextState, displayState)), {state})
  .state;

const answer = activeCount(state.cube);
const success = answer === expected;

console.dir({
  // history: reducer.history,
  answer, expected, success, iters: state.iterations,
}, {depth: null});
