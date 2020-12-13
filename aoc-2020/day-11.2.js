/*
  Notes:
  https://adventofcode.com/2020/day/11

  * Had to differentiate floor and undefined
  * LOL: error handling appeared!

*/

// const puzzleInput = document.body.innerText;
const puzzleInput = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`

// floor (.), an empty seat (L), or an occupied seat (#)
const FLOOR = '.';
const EMPTY = 'L';
const OCCUPIED = '#';
const DESIRABLE = 0;
const UNDESIRABLE = 5;
const View = {
  ADJACENT: 'ADJACENT',
  VISIBLE: 'VISIBLE',
}
const VIEW = View.VISIBLE;

const pos = (x, y) => ({x, y});
const directions = [
  pos(-1, -1), pos(-1, 0), pos(-1, 1),
  pos(0, -1),          pos(0, 1),
  pos(1, -1),  pos(1, 0),  pos(1, 1),
];

// If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
// If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
// Otherwise, the seat's state does not change.
// Floor (.) never changes; seats don't move, and nobody sits on the floor.

function current(seats, x, y) {
  if (y < 0 || y >= seats.length || x < 0 || x >= seats[0].length) {
    return undefined;
  } else {
    return seats[y][x];
  }
}

function isOccupied(seats, x, y) {
  return current(seats, x, y) === OCCUPIED;
}

function findVisible(seats, dir, x, y) {
  const x1 = x + dir.x;
  const y1 = y + dir.y
  return current(seats, x1, y1) === FLOOR
    ? findVisible(seats, dir, x1, y1)
    : pos(x1, y1);
}

function seatsVisible(seats, x, y) {
  if (VIEW === View.ADJACENT) {
    return directions.map(dir => pos(x + dir.x, y + dir.y));
  } else if (VIEW === View.VISIBLE) {
    return directions.map(dir => findVisible(seats, dir, x, y));
  } else {
    throw new Error('Unrecognized visibility: ' + VIEW);
  }
}

function nextSeat(seats, x, y) {
  const s = current(seats, x, y);
  if (s === FLOOR || s === undefined) {
    return FLOOR
  }

  const neighbors = seatsVisible(seats, x, y)
    .reduce((n, visible) => n + isOccupied(seats, visible.x, visible.y), 0);

  if (s === EMPTY && neighbors <= DESIRABLE) {
    return OCCUPIED;
  } else if (s === OCCUPIED && neighbors >= UNDESIRABLE) {
    return EMPTY;
  } else {
    return s;
  }
}

function nextSeating(seats) {
  return seats.map((row, y) => row.map((seat, x) => nextSeat(seats, x, y)))
}

function seatsEqual(a, b) {
  return a === b || a && b &&
    a.every((aRow, y) => aRow.every((aSeat, x) => aSeat === b[y][x]));
}


function solve(history) {
  if (seatsEqual(...history.slice(-2))) {
    return history;
  } else {
    return solve([...history, nextSeating(...history.slice(-1))]);
  }
}

function seatMap(seats) {
  return seats.map(row => row.join('').concat('           ')); // padding so node doesn't print 2 cols
}

// ================

const input = puzzleInput
  .split('\n')
  .filter(i => i.length)
console.log("records: ", input.length);

const seats0 = input
  .map(row => row.split(''));
console.log('seats:', seatMap(seats0));

const history = solve([seats0]);
const [result] = history.slice(-1);

// console.dir(history.map(seatMap), {depth: null});

// How many seats end up occupied?
const occupied = result
  .reduce((n, row, y) => n + row.reduce((n, seat, x) => n + isOccupied(result, x, y), 0), 0);

console.log('result:', occupied);
