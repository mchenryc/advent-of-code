/*
  Notes:
  https://adventofcode.com/2020/day/12

  * Did day 12 after day 9 because I was behind. That's what being on a
    leaderboard will do: competition much?
  * Interesting that I went w/ cartesian, vs screen coords
  * Back to functional - imperative seems to be more 'rush panic mode'
    but I can't tell which is more efficient.

*/

const puzzleInput = document.body.innerText;
// const puzzleInput = `
// F10
// N3
// F7
// R90
// F11
// `

const input = puzzleInput
  .split('\n')
  .filter(i => i.length)
console.log("records: ", input.length);

const instructions = input
  .map(instr => ({a: instr[0], v: Number(instr.slice(1))}));
console.log('instructions:', instructions);

const Dir = {
  N: 0,
  E: 1,
  S: 2,
  W: 3,
};

// state: { dir:Dir, pos:[x,y] }
const repos = (s, x, y) => ({
  dir: s.dir,
  pos: [s.pos[0] + x, s.pos[1] + y],
  delta: ['pos', x, y]});
const redir = (s, deg) => ({
  dir: (4 + s.dir + ((deg / 90) % 4)) % 4,
  pos: s.pos,
  delta: ['dir', deg / 90]});
const forward = (s, v) =>
  repos(s, (s.dir % 2) * -(s.dir - 2) * v, ((s.dir % 2) - 1) * (s.dir - 1) * v);

const commands = {
  N: (s,v) => repos(s, 0, v), // "move north by the given value.",
  S: (s,v) => repos(s, 0, -v), // "move south by the given value.",
  E: (s,v) => repos(s, v, 0), // "move east by the given value.",
  W: (s,v) => repos(s, -v, 0), // "move west by the given value.",
  L: (s,v) => redir(s, -v), // "turn left the given number of degrees.",
  R: (s,v) => redir(s, v), // "turn right the given number of degrees.",
  F: (s,v) => forward(s, v), // "move forward by the given value in the direction the ship is currently facing.",
}

const state0 = {dir: Dir.E, pos: [0,0]};

const history = instructions
  .reduce((acc, i) =>
    [...acc, {i, state: commands[i.a](acc[acc.length-1].state, i.v)}],
    [{state: state0}]);

console.dir(history, {depth: null});

const manhattan = history[history.length-1].state.pos
  .map(Math.abs)
  .reduce((sum, n) => sum + n);

console.log('manhattan:', manhattan);
