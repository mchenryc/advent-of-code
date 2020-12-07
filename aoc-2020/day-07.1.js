/*
  Notes:
  https://adventofcode.com/2020/day/7

  * first: 468 too high - had non-unique answers (derp, saw initially at outset :()

*/

var puzzleInput = document.body.innerText;

var input = puzzleInput
  .split('\n')
  //   .filter((line, i) => i < 10)
  .filter(i => i.length); // empty lines are relevant in this one
console.log("records: ", input.length);

var primaryBag = "shiny gold";

function parseBag(bag) {
  // ignore surrounding whitespace
  const re = /(?:(?<n>\d+) )?(?<color>\w+ \w+) bags?/.exec(bag)
  if (re) return {n: Number(re.groups.n), color: re.groups.color };
  throw new Error(`Malformed bag: ${bag}`);
}

function parseLine(line) {
  const [parent, children] = line.split('contain');
  return {
    color: parseBag(parent).color,
    children: children.split(',')
      .map(parseBag)
      .reduce((acc, {n, color}) => {
        acc[color] = n;
        return acc;
      }, {})
  }
}

function containingOptions(color) {
  const parents = childIndex[color]
  if (!parents) {
    return [];
  } else {
    return [...parents, ...parents.flatMap(containingOptions)]
  }
}

var rules = input
  .map(parseLine);
console.log('rules', rules);

var childIndex = rules
  .reduce((acc, rule) => {
    Object.keys(rule.children).forEach(color => {
      (acc[color] = acc[color] || []).push(rule.color)
    })
    return acc;
  }, {})
console.log('childIndex', childIndex)

var results = new Set(containingOptions(primaryBag));

console.log('result', results.size)

results

