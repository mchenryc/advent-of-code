/*
  Notes:
  https://adventofcode.com/2020/day/8

  * Switched to developing using Node, not Chrome DevConsole: so `const` :)

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

const hist = new Set();
let state, next = { pc: 0, acc: 0 };

while (!hist.has(next.pc)) {
  const {pc, acc} = (state = next);
  const {op, arg} = instructions[pc];
  next = ops[op](pc, acc, arg);
  hist.add(pc);
}

console.log('results:', state);
