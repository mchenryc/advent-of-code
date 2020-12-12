/*
  Notes:
  https://adventofcode.com/2020/day/12

  * Enjoyed this one
  * Feel 'safer' in functional mode - like there are just fewer 'hidden' bugs

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

// state: { way:[x,y], pos:[x,y] }
const wayPos = (s, x, y) => ({
  way: [s.way[0] + x, s.way[1] + y],
  pos: s.pos,
  delta: ['wayPos', x, y]});
const toRad = (deg) => deg * (Math.PI / 180);
const rotate = (pos, rad) => [
  // x' = cx + (x-cx) * cos(theta) - (y-cy) * sin(theta)
  // y' = cy + (x-cx) * sin(theta) + (y-cy) * cos(theta)
  // cx,cy = 0,0 (waypoint is relative)
  (pos[0] * Math.cos(rad) - pos[1] * Math.sin(rad)),
  (pos[0] * Math.sin(rad) + pos[1] * Math.cos(rad)),
].map(Math.round);
const wayRot = (s, deg) => ({
  way: rotate(s.way, toRad(deg)),
  pos: s.pos,
  delta: ['wayRot', deg]});
const wayFwd = (s, v) => ({
  way: s.way,
  pos: s.pos.map((p,i) => p + v * s.way[i]),
  delta: ['wayFwd', ...s.pos.map((p,i) => v * s.way[i])]
})

const commands = {
  N: (s,v) => wayPos(s, 0, v),  // Action N means to move the waypoint north by the given value.
  S: (s,v) => wayPos(s, 0, -v), // Action S means to move the waypoint south by the given value.
  E: (s,v) => wayPos(s, v, 0),  // Action E means to move the waypoint east by the given value.
  W: (s,v) => wayPos(s, -v, 0), // Action W means to move the waypoint west by the given value.
  L: (s,v) => wayRot(s, v),  // Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
  R: (s,v) => wayRot(s, -v),   // Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
  F: (s,v) => wayFwd(s, v), // Action F means to move forward to the waypoint a number of times equal to the given value.
}

const state0 = {way: [10,1], pos: [0,0]};

const history = instructions
  .reduce((acc, i) =>
    [...acc, {i, state: commands[i.a](acc[acc.length-1].state, i.v)}],
    [{state: state0}]);

console.dir(history, {depth: null});

const manhattan = history[history.length-1].state.pos
  .map(Math.abs)
  .reduce((sum, n) => sum + n);

console.log('manhattan:', manhattan);
