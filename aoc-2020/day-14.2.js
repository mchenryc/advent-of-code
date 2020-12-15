/*
  Notes:
  https://adventofcode.com/2020/day/14

  * Killed the browser when run w/ full data (never tried in node)
  * Mutated memory, and nixed history (and all the other debugging ;) )
    to get it to finish

*/

// const expected = undefined;
// const puzzleInput = document.body.innerText;
const expected = 208n;
const puzzleInput = `
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
`

const WORD_SIZE = 36n;

const input = puzzleInput
  .split('\n')
  .filter(i => i.length)
console.log("records: ", input.length);

const program = input
  .map(row => row.split(' = '))
  .map(([op, value]) => asAction(op, value));
console.dir({program}, {depth: null});


function asAction(op, value) {
  const m = op.match(/mem\[(\d+)]/);
  if (m) {
    return {op: 'mem', payload: {address: BigInt(m[1]), value: BigInt(value)} };
  } else if (op === 'mask') {
    const payload0 = {floatMask: 0n, override: 0n, floatShifts: []};
    return {
      op,
      payload: value.split('')
        .reduce((payload, k, i) => ({
            maskString: value,
            floatMask: (payload.floatMask << 1n) | (k !== 'X' ? 1n : 0n),
            override: (payload.override) << 1n | (k === '1' ? 1n : 0n),
            // ordered so that least significant bit is indexed 0
            floatShifts: k !== 'X' ? payload.floatShifts : [WORD_SIZE - 1n - BigInt(i), ...payload.floatShifts],
          }),
          payload0),
    };
  }
  else throw new Error('unrecognized op: ' + op);
}

const reducers = {
  mask: (state, payload) => ({ ...state, ...payload }),
  mem: (state, payload) => {
    // TODO: mutator! is death on browser due to memory?
    const memory = state.memory; //{...state.memory};

    // all the floating possibilities
    const nFloatBits = BigInt(state.floatShifts.length)
    const floatMax = 2n**nFloatBits;

    let addresses = [];
    console.log('==writing', state.maskString, 'nFloatBits', nFloatBits, payload);
    for (let floatValue = 0n; floatValue < floatMax; floatValue++) {
      console.log('  ==floatValue', floatValue.toString(2));
      let address = payload.address & state.floatMask | state.override;
      // console.log('  == original', payload.address.toString(2),
      //   '& floatMask', state.floatMask.toString(2),
      //   '| override', state.override.toString(2),
      //   '= start', address.toString(2));
      for (let floatBitPos = 0n; floatBitPos < nFloatBits; floatBitPos++) {
        // console.log('    ==floatBitPos', floatBitPos);
        const floatBit = BigInt(!!(floatValue & 2n**floatBitPos));
        const addrBitValue = floatBit << state.floatShifts[floatBitPos];
        address = address | addrBitValue;
        // console.log('      == floatPos', floatBitPos,
        //   'shift', state.floatShifts[floatBitPos],
        //   'fbv', floatBit, 'abv', addrBitValue.toString(2), 'address step: ', address.toString(2));
      }
      // console.log('    ==address', address.toString(2));
      addresses = [...addresses, address];
    }
    // throw "die";
    console.log('   writing to', addresses);
    addresses.forEach(address => memory[''+address] = payload.value);

    return ({...state, addresses, memory});
  }
}

const state0 = { mask: null, memory: {} };
const prevState = history => history.slice(-1)[0][1]
const pushState = (history, next) => [next]; // << only prev, full: [...history, next];

const history = program.reduce((history, instr) => {
  const prev = prevState(history);
  const next = [instr, reducers[instr.op](prev, instr.payload)];
  return pushState(history, next);
}, [[null, state0]])
console.log('==complete');

const memory = prevState(history).memory;
const sum = Object.values(memory).reduce((sum, n) => n ? sum + n : sum, 0n);

console.dir({success: sum === expected, sum, history}, {depth: null});
