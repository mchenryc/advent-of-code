/*
  Notes:
  https://adventofcode.com/2020/day/4

  * Not very interesting.
  * Issue using regex - g flag makes it stateful (and is unnecessary here)!!
*/


var input = document.body.innerText
    .split('\n')
//    .filter((line, i) => i < 10)
//    .filter(i => i.length); // empty lines are relevant in this one
console.log("lines: ", input.length);

// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
// If cm, the number must be at least 150 and at most 193.
// If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.

var yearRe = /^(\d{4})$/;
var inBounds = (lower, upper) => (n) => n >= lower && n <= upper;
var yearInBounds = (lower, upper) =>
    (v) => yearRe.test(v) && inBounds(lower, upper)(v);

var fields = [
    {id: 'byr', descr: '(Birth Year)', test: yearInBounds(1920, 2002) },
    {id: 'iyr', descr: '(Issue Year)', test: yearInBounds(2010, 2020) },
    {id: 'eyr', descr: '(Expiration Year)', test: yearInBounds(2020, 2030) },
    {id: 'hgt', descr: '(Height)', test: (v) => {
            const [ignore, n, units] = /^(\d+)(cm|in)$/.exec(v) || [];
            switch (units) {
                case 'cm': return inBounds(150, 193)(n);
                case 'in': return inBounds(59, 76)(n);
                default: return false;
            }
        }},
    {id: 'hcl', descr: '(Hair Color)', test: (v) => /^#[0-9a-f]{6}$/.test(v) },
    {id: 'ecl', descr: '(Eye Color)', test: (v) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(v) },
    {id: 'pid', descr: '(Passport ID)', test: (v) => /^\d{9}$/.test(v) },
    {id: 'cid', descr: '(Country ID)', test: (v) => true },
];

// Part 1 fields
// var exists = (v) => v !== undefined;
// var fields = [
//     {id: 'byr', descr: '(Birth Year)', test: exists },
//     {id: 'iyr', descr: '(Issue Year)', test: exists },
//     {id: 'eyr', descr: '(Expiration Year)', test: exists },
//     {id: 'hgt', descr: '(Height)', test: exists },
//     {id: 'hcl', descr: '(Hair Color)', test: exists },
//     {id: 'ecl', descr: '(Eye Color)', test: exists },
//     {id: 'pid', descr: '(Passport ID)', test: exists },
//     {id: 'cid', descr: '(Country ID)', test: () => true },
// ];

// test double break
input.splice(input.findIndex(line => line.length === 0), 0, "")

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

function docFieldTests(doc) {
    return fields.reduce((acc, field) =>
        Object.assign(acc, { [field.id]: field.test(doc[field.id]) }), {})
}
function fieldTestAcceptance(fieldTests) {
    return Object.values(fieldTests)
        .every(test => test)
}

var result = docs
    .map(doc => ({doc})) // as records for debugging
    .map(r => ({...r, tests: docFieldTests(r.doc)}))
    .map(r => ({...r, accept: fieldTestAcceptance(r.tests)}))

console.log('accepted', result.filter(r => r.accept).length)
