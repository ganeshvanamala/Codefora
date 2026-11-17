import fs from 'fs';

// Read problems.js
const p1Content = fs.readFileSync('src/data/problems.js', 'utf8');
const titleMatches1 = [...p1Content.matchAll(/"title":\s*"([^"]+)"/g)].map(m => m[1]);

// Read problemsDryRun.js and its imports
let titleMatches2 = [];
for (let i = 1; i <= 60; i+=5) {
  const start = i;
  const end = i + 4;
  const file = 'src/data/problems/problems' + start + '_' + end + '.js';
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(/title:\s*"([^"]+)"/g)].map(m => m[1]);
    titleMatches2 = titleMatches2.concat(matches);
  }
}

console.log('Total problems in Codefora:', titleMatches1.length);
console.log('Total problems in DryRun:', titleMatches2.length);

let missing = 0;
titleMatches1.forEach(t1 => {
  if (!titleMatches2.includes(t1)) {
    console.log('Codefora problem missing in DryRun:', t1);
    missing++;
  }
});
console.log('Total Codefora problems missing in DryRun:', missing);

missing = 0;
titleMatches2.forEach(t2 => {
  if (!titleMatches1.includes(t2)) {
    console.log('DryRun problem missing in Codefora:', t2);
    missing++;
  }
});
console.log('Total DryRun problems missing in Codefora:', missing);
