/*
  Notes:
  https://adventofcode.com/2020/day/6

*/

var puzzleInput = document.body.innerText;

var input = puzzleInput
  .split('\n')
//   .filter((line, i) => i < 10)
//  .filter(i => i.length); // empty lines are relevant in this one
console.log("records: ", input.length);

var groups = input
  .filter((line, i, arr) => i === 0 || line.length > 0 || (arr[i-1].length > 0 && i !== arr.length-1) ) // remove duplicate breaks
  .reduce((groups, response) => {
    const group = response.length && groups.pop() || { responses:[] };
    if (response.length) {
      group.responses.push(response);
    }
    groups.push(group);
    return groups;
  }, []);
console.log('groups', groups.length)

var result = groups
  .map(g => ({...g,
    yesQs: g.responses
      .map(resp => resp.split(''))
      .reduce((yesQs, indvYesQs) => yesQs
          ? new Set([...yesQs].filter(q => indvYesQs.includes(q)))
          : new Set(indvYesQs),
        null)
  }))
  .map(g => ({...g, yesCount: g.yesQs.size }))

console.log('sum', result
  .map(g => g.yesCount)
  .reduce((a,b) => a + b, 0));
