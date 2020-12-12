/*
  Notes:
  https://adventofcode.com/2020/day/9

  * Straight to imperative - wanted to finish quickly, but was it really faster?

*/

// const preamble = 25;
// const puzzleInput = document.body.innerText;

const preamble = 5;
const puzzleInput = `
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
`

const input = puzzleInput
  .split('\n')
  .filter(i => i.length)
  .map(Number);
console.log("records: ", input.length);

const winStart = 1, winStop = preamble +1;
let exception;

exceptionLoop:
for (let i = 0; i < input.length; i++) {
  if (i >= preamble) {
    const n = input[i];
    for (let j = winStart; j < winStop; j++) {
      const a = input[i - j];
      for (let k = winStart; k < winStop; k++) {
        if (j !== k && n === (a + input[i - k])) {
          continue exceptionLoop;
        }
      }
    }
    exception = n;
  }
}

let weakness;
let sum = 0;

weaknessLoop:
for (let i = 0; i < input.length - 1; i++) {
  let sum = input[i];
  for (let j = i + 1; j < input.length; j++) {
    sum += input[j];
    if (sum === exception) {
      const span = input.slice(i, j+1);
      console.log(i, j, input[i], input[j])

      weakness = Math.min.apply(null, span) + Math.max.apply(null, span);
      break weaknessLoop;
    } else if (sum > exception) {
      break;
    }
  }
}



console.log('exception:', exception);
console.log('weakness:', weakness);
