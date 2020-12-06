/*
  Notes:
  https://adventofcode.com/2020/day/4

  * First submission was a failure of set operations (diff(a, b)) all passports accepted

*/


var input = document.body.innerText
    .split('\n')
//   .filter((line, i) => i < 10)
//  .filter(i => i.length); // empty lines are relevant in this one
console.log("records: ", input.length);

var fields = {
    'byr': '(Birth Year)',
    'iyr': '(Issue Year)',
    'eyr': '(Expiration Year)',
    'hgt': '(Height)',
    'hcl': '(Hair Color)',
    'ecl': '(Eye Color)',
    'pid': '(Passport ID)',
    'cid': '(Country ID)',
}
var expectedFields = Object.keys(fields);
var optionalFields = new Set(['cid']);
var requiredFields = expectedFields.filter(f => !optionalFields.has(f))

// part 1
var docs = input
    .filter((line, i, arr) => i === 0 || line.length > 0 || arr[i-1].length > 0) // remove duplicate breaks
    .map(line => line.split(' '))
    .flatMap(data => data
        .map(d => d.split(':'))
        .map(([k,v]) => v === undefined ? undefined : {[k]: v})
    )
    .reduce((docs, entry) => {
        if (entry) {
            docs.push({...(docs.pop() || {}), ...entry});
        } else {
            docs.push({});
        }
        return docs;
    }, []);
console.log('docs', docs.length)

var result = docs
    .map(doc => ({doc})) // as records for debugging
    //   .map(r => ({...r, keys: Object.keys(r.doc)}))
    .map(r => ({...r, missing: requiredFields.filter(f => !r.doc.hasOwnProperty(f)) }))
    .map(r => ({...r, accept: r.missing.length === 0}))

console.log(result.filter(r => r.accept).length)
