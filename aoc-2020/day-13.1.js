/*
  Notes:
  https://adventofcode.com/2020/day/13

*/

// const puzzleInput = document.body.innerText;
const expected = 295
const puzzleInput = `
939
7,13,x,x,59,x,31,19
`

const input = puzzleInput
  .split('\n')
  .filter(i => i.length)
console.log("records: ", input.length);

const config = {
  earliest: Number(input[0]),
  busses: input[1].split(',')
    .map(Number)
    .filter(x => !isNaN(x))
};
console.dir(config, {depth: null});

function waitsAfter(busses, time) {
  return busses.map(bus => ({ bus: bus, wait: bus - (time % bus) }));
}

// ===================

const waits = waitsAfter(config.busses, config.earliest);

const result = waits.sort((a, b) => a.wait - b.wait)[0];

// console.dir(history.map(seatMap), {depth: null});

console.log('result:', result.bus * result.wait);
