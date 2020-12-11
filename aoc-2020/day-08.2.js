/*
  Notes:
  https://adventofcode.com/2020/day/8

  * Switched to developing using Node, not Chrome DevConsole: so `const` :)
  * Brute first, quickly first day, forward was longer and delayed by IRL work
  * My Input:
  *    brute: run 298
  *    forward: run 45 (128 steps)

*/

// const puzzleInput = document.body.innerText;
const puzzleInput = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`

const input = puzzleInput
  .split('\n')
  .filter(i => i.length);
console.log("records: ", input.length);

const instructions = input
  .map(instr => instr.split(' '))
  .map(([op, arg]) => ({op, arg: Number(arg)}));

const ops = {
  acc: (pc, acc, arg) => ({ pc: pc + 1, acc: acc + arg }),
  jmp: (pc, acc, arg) => ({ pc: pc + arg, acc }),
  nop: (pc, acc, arg) => ({ pc: pc + 1, acc }),
}
const swaps = {
  jmp: 'nop',
  nop: 'jmp',
}

function execute(program) {
  const hist = new Map();
  let state, next, step;

  for (state = { pc: 0, acc: 0 }, step = 0; state.pc < program.length; state = next, step++) {
    const {op, arg} = program[state.pc];
    next = ops[op](state.pc, state.acc, arg);
    hist.set(state.pc, {...next});

    if (hist.has(next.pc)) {
      break;
    }
  }
  return { state, complete: didComplete(state, program), hist };
}

const NO_SWAP = -1;
function swapCheck(instr, swap, step) {
  if (swap.step === undefined && step >= swap.start && swapAvail(instr)) {
    return {start: swap.start, step: step, instr: swapOp(instr)}
  } else {
    return {start: swap.start, step: swap.step};
  }
}
/**
 * @param program
 * @param swapStart may be NO_SWAP
 */
function executeSwapping(program, swapStart) {
  const hist = new Map();
  let state = { pc: 0, acc: 0 }, next, step;
  let swap = {
    start: swapStart,
    step: swapStart === NO_SWAP ? NO_SWAP : undefined, // could end up being 0
  }

  for (step = 0; state.pc < program.length; state = next, step++) {
    const peek = program[state.pc];
    swap = swapCheck(peek, swap, step);
    const instr = swap.instr || peek;

    next = ops[instr.op](state.pc, state.acc, instr.arg);
    hist.set(state.pc, {next, swap}); // clever, or cruel?

    if (hist.has(next.pc)) {
      break;
    }
  }
  return { state, complete: didComplete(state, program), swap, hist };
}

function didComplete(state, instructions) {
  return state.pc === instructions.length
}
function swapAvail(instruction) {
  return swaps.hasOwnProperty(instruction.op);
}
function swapOp(instr) {
  return {op: swaps[instr.op] || instr.op, arg: instr.arg};
}
function swapOne(instructions, swapIdx) {
  return instructions.map((instr, i) => i === swapIdx ? swapOp(instr) : instr)
}
function diagnostics(program, hist) {
  return program.map((instr, i) => [i, instr, hist.get(i)])
}

function brute() {
  let swap = -1;
  for (let run = 0; run < instructions.length; run++) {
    const program = swapOne(instructions, swap);
    const {state, complete, hist} = execute(program);
    if (complete) {
      console.dir({run, swap, complete, state, diagnostics: diagnostics(program, hist)}, {depth: null});
      break;
    }
    swap++;
  }
}

function forward() {
  let swapStart = NO_SWAP;

  for (let run = 0; run < instructions.length; run++) { // prevent our own loop
    const {state, complete, swap, hist} = executeSwapping(instructions, swapStart)
    if (complete) {
      console.dir({
        run: {run, complete, steps: hist.size, state, swap},
        diagnostics: diagnostics(instructions, hist),
        hist,
      }, {depth: null});
      break;
    }
    swapStart = swap.step + 1;
  }
}

console.info('===========brute')
brute();
// added diagnostics
console.info('===========forward')
forward();
