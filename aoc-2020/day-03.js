/*
  Notes:
  https://adventofcode.com/2020/day/3
  
  * Went stright to imperative, did functional before part 2
  * My map would have had 0,0 be a hit - noticed in his example markup that 0,0 was not considered
  * Imperative first on part 2 also
  * The slope logic (for slope < 1/2) felt unintuitive for the functional version
    * part 1 is "skip row-0 arbitrarily', part 2 is "skip n rows every step"
*/


var input = document.body.innerText
  .split('\n')
  .filter(i => i.length);
console.log("records: ", input.length);

// part 1
var slope = {x: 3, y: 1};
var trees = input
  .map(i => i.split(''))
console.log('trees', trees.length, trees[0].length);


// part 1.1
var hits = 0;
for (var pos = {x:slope.x, y:slope.y};
     pos.y < trees.length;
     pos.x += slope.x, pos.y += slope.y) {
  const px = pos.x % trees[0].length;
  const tile = trees[pos.y][px];
  // console.log('pos', pos.x, `(${px})`, pos.y, tile)
  if (tile === '#') {
    hits++;
  }
}
console.log('1.1', hits)

// part 1.1
var hits = trees
  .map((row, i) => row[(i*3) % row.length])
  .filter((tile, i) => i > 0)
  .filter(tile => tile === '#')
  .length
console.log('1.2', hits)


// part 2
var slopes = [
  {x: 1, y: 1},
  {x: 3, y: 1},
  {x: 5, y: 1},
  {x: 7, y: 1},
  {x: 1, y: 2},
]

var product = 1;

for (const slope of slopes) {
  var hits = 0;
  for (var pos = {x:slope.x, y:slope.y};
       pos.y < trees.length;
       pos.x += slope.x, pos.y += slope.y) {
    const px = pos.x % trees[0].length;
    const tile = trees[pos.y][px];
    if (tile === '#') {
      hits++;
    }
  }
  product *= hits;
}
console.log('2.1', product)


var product = slopes
  .map(slope =>
    trees
      .map((row, i) => row[Math.floor(i * slope.x/slope.y) % row.length])
      .filter((tile, i) => (i % slope.y) === 0)
      .filter(tile => tile === '#')
      .length
  )
  .reduce((total, hits) => total * hits, 1)

console.log('2.2', product)
