/*
  Notes:
  https://adventofcode.com/2020/day/7

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
  if (re) {
    if (re.groups.color === 'no other') {
      return {}
    } else {
      return {n: Number(re.groups.n), color: re.groups.color};
    }
  }
  throw new Error(`Malformed bag: ${bag}`);
}

function parseLine(line) {
  const [parent, children] = line.split('contain');
  return {
    color: parseBag(parent).color,
    children: children.split(',')
      .map(parseBag)
      .filter(entry => entry.color)
      .reduce((acc, {color, n}) => {
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

function findChildrenCount(color) {
  return Object.entries(parentIndex[color] || {})
    .map(x => {
      console.log('=== ', color, '::', x)
      return x;
    })
    .reduce((acc, [color, n]) =>
      acc + n + n * findChildrenCount(color), 0)
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

var parentIndex = rules
  .reduce((acc, rule) => {
    acc[rule.color] = rule.children
    return acc;
  }, {})
console.log('parentIndex', parentIndex)

var results = findChildrenCount(primaryBag);

console.log('result', results)


