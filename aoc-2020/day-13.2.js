/*
  Notes:
  https://adventofcode.com/2020/day/13

  * Struggling w/ the big one

*/

// const puzzleInput = document.body.innerText;
const startMin = 0;

const puzzleInputs = [
  `
  11
  x,2,x,x,5,8
  `,
  `
1068781
7,13,x,x,59,x,31,19
`,
`
3417
17,x,13,19
`,
`
779210
67,x,7,59,61
`,
`
1261476
67,7,x,59,61
`,
`
1202161486
1789,37,47,1889
`,
// const startMin = 100000000000000;
// const puzzleInput =
// `
// 1006401
// 17,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,449,x,x,x,x,x,x,x,23,x,x,x,x,13,x,x,x,x,x,19,x,x,x,x,x,x,x,x,x,x,x,607,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,29
// `,
];
// lcm: 1157956703986823,
// stopped: n=572311030000
//          100000000000000

const inputs = puzzleInputs.map(puzzleInput =>
  puzzleInput
    .split('\n')
    .filter(i => i.length)
)

const configs = inputs.map(input => ({
  expected: Number(input[0]),
  busses: input[1].split(',')
    .map(Number)
}));
console.dir(configs, {depth: null});

function waitsAfter(busses, time) {
  return busses.map(bus => ({ bus: bus, wait: (bus - (time % bus)) % bus }));
}

function match(waitsA, waitsB) {
  return waitsA.every((bus, i) => bus.wait === waitsB[i].wait);
}

function gcd(a, b) {
  while(a) [a,b] = [b % a, a];
  return b;
}
function lcm(a, b) {
  return a * b / gcd(a, b);
}

function waitFor(t, b) {
  const remain = t % b.bus;
  return remain && b.bus - remain;
}

function isTimeMagic(t, b) {
  const wait = waitFor(t, b);
  return wait === b.wait;
}

/** Magic time for 2 routes */
function magicTime(a, b) {
  for (let n = 1; true; n++) {
    const time = n * a.bus + (a.bus - a.wait);

    if (isTimeMagic(time, b)) {
      return time;
    }
    if (n % 100 === 0) {
      console.log(`progress([${a.bus}:${a.wait}], [${b.bus},${b.wait}])`, n);
    }
  }
}


function solve(busses, expected) {
  const magicWaits = busses
    .map((bus,i) => ({bus, wait: i}))
    .filter(bus => !!bus.bus);
  const descendingMagic = magicWaits.slice(0)
    .sort((a,b) => b.bus - a.bus);
  const slow = descendingMagic[0];
  const descendingRest = descendingMagic.slice(1);

  // 17,x,13,19
  // 3417

  // [2,1], [5,4], [8,5]
  // 2:    1 + 1 = 2,    3 + 1 = 4,    5 + 1 = 6,    7 + 1 = 9,    9 + 1 = 10,    11 + 1 = 12
  // 5:    1 + 4 = 5,    6 + 4 = 10,   11 + 4 = 15,
  // 8:    3 + 5 = 8,    11 + 5 = 16
  //          ***
  // b,w:  n   t  + w = n*b:   n*b -w  =  n*b-w   diff=29
  // 2,1:  6: (11 + 1 = 12):   6*2 -1  =  12 -1 .
  // 5,4:  3: (11 + 4 = 15):   3*5 -4  =  15 -4 .
  // 8,5:  2: (11 + 5 = 16):   2*8 -5  =  16 -5
  // t:    11
  // lcm:  40
  // diff: 29
  // sum(b): 2,5,8 = 15
  // sum(n*w): 6*1, 3*4, 2*5 = 6,12,10 = 28    :: coincident that it is diff-1?

  // var v = [4,1], [4,2], [4,3]
  // lcm: 40
  // [4:1]: 5, 10,
  // [4:2]:
  // [4:3]: (8)12, (16)20, (24)28

  // |0|0|0|0|0|x|0|0|0|0|
  // |0...|0...|x...|0...|
  // |..0....|..x....|..0....|

  const state = descendingRest.reduce((s, route) =>
    ({ prior: route, magics: [...s.magics, magicTime(s.prior, route)] }),
    { prior: slow, magics: [] },
  );
  const time = state.magics.reduce(lcm);

  console.dir({
    success: expected === time,
    expected,
    time____: time,
    isMagic: magicWaits.every(b => isTimeMagic(time, b)),
    magicWaits: magicWaits.map((b,i) =>
      ({ ...b, actual: waitFor(time, b), isMagic: isTimeMagic(time, b) })),
    state,
  }, {depth: null});



  // const history = [];
  // let state = {n: 0};
  // // hackery
  // const startN = Math.floor(startMin / slow.bus); // not really useful
  // const step = magicWaits.map(a => a.bus).reduce(lcm);
  //
  // for (let n = startN; true; n++) {
  //   const time = n * slow.bus + (slow.bus - slow.wait);
  //
  //   const isMagic = descendingRest
  //     .every(b => {
  //       return isTimeMagic(time, b);
  //       // const wait = b.bus - (time % b.bus);
  //       // return wait === b.wait || wait - b.bus === b.wait;
  //     });
  //   state = {n, time, isMagic };
  //
  //   // const waits = waitsAfter(busses, time)
  //   //   .filter(bus => !isNaN(bus.bus))
  //   // const isMagic = match(magicWaits, waits);
  //   // state = {n, time, isMagic, waits};
  //
  //   history.push(state);
  //
  //   if (n % 10000 === 0) {
  //     // console.log('progress',n);
  //   }
  //   if (isMagic) {// || n>10) {
  //     state = {...state, waits: waitsAfter(busses, time).filter(bus => !!bus.bus) };
  //     break;
  //   }
  // }
  // const _lcm = magicWaits.map(a => a.bus).reduce(lcm);
  // console.dir({success: expected === state.time,
  //   expected,
  //   fin_time: state.time,
  //   lcm_____: _lcm,
  //   diff____: _lcm - state.time,
  //
  //   startN, magicWaits, slow}, {depth: null});
}

// ===================
configs.forEach(config => solve(config.busses, config.expected));
