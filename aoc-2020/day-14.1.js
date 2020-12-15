/*
  Notes:
  https://adventofcode.com/2020/day/14

  * Realised quickly, I'd begun reimplementing flux.
  * Jerk - had it all implemented bitwise before noticing: 36 bits, not 32
    which is js's max for bitwise operators
  * Implemented a Long type - to deal with large bit manipulation
    (why doesn't js have this? wait for it...)
  * Initial: 631163242 too low
    * fixed `value()` bitwise `xor` is not `exponentiation`!
  * 17811032290 too low
  * Bad Long implementation? Oh!! js has BigInt! Derp.
    * same answer - cool, at least my Long was right...
  * Good grief - screwed up the summing reducer.
    ALWAYS the little things re-implemented

*/

// const expected = undefined;
// const puzzleInput = document.body.innerText;
const expected = 165;
const puzzleInput = `
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
`

const input = puzzleInput
  .split('\n')
  .filter(i => i.length)
console.log("records: ", input.length);

const program = input
  .map(row => row.split(' = '))
  .map(([op, value]) => asAction(op, value));
console.log('program:', program);


function asAction(op, value) {
  const m = op.match(/mem\[(\d+)]/);
  if (m) {
    return {op: 'mem', value: {reg: m[1], value: BigInt(value)} };
  } else if (op === 'mask') {
    const value0 = {mask: 0n, override: 0n};
    return {
      op,
      value: value.split('')
        .reduce((value, k) => ({
            mask: (value.mask << 1n) | (k === 'X' ? 1n : 0n),
            override: (value.override) << 1n | (k === '1' ? 1n : 0n),
          }),
          value0),
    };
  }
  else throw new Error('unrecognized op: ' + op);
}

const reducers = {
  mask: (s, value) => ({ ...s, ...value }),
  mem: (s, value) => {
    const memory = [...s.memory];
    memory[value.reg] = value.value & s.mask | s.override;
    return ({...s, memory});
  }
}

const state0 = { mask: null, memory: [] };
const prevState = history => history.slice(-1)[0][1]
const pushState = (history, next) => [...history, next];

const history = program.reduce((history, instr) => {
  const prev = prevState(history);
  const next = [instr, reducers[instr.op](prev, instr.value)];
  return pushState(history, next);
}, [[null, state0]])

const memory = prevState(history).memory;
const sum = memory.reduce((sum, n) => n ? sum + n : sum, 0n);

console.dir({success: sum === expected, sum, history}, {depth: null});
