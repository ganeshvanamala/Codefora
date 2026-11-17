const fs = require('fs');

// Read backend problems
const problems = JSON.parse(fs.readFileSync('C:/Users/Ganesh Vanamala/Downloads/Codefora-main/Codefora-main/backend/data/problems.json'));
const titleMatches1 = problems.map(p => p.title);

// Read problemsDryRun.js and its imports
let titleMatches2 = [];
for (let i = 1; i <= 60; i+=5) {
  const start = i;
  const end = i + 4;
  const file = 'C:/Users/Ganesh Vanamala/Downloads/Codefora-main/Codefora-main/frontend/src/data/problems/problems' + start + '_' + end + '.js';
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(/title:\s*"([^"]+)"/g)].map(m => m[1]);
    titleMatches2 = titleMatches2.concat(matches);
  }
}

let missing = 0;
titleMatches1.forEach(t1 => {
  if (!titleMatches2.includes(t1)) {
    console.log('Codefora backend problem missing in DryRun:', t1);
    missing++;
  }
});
console.log('Total Codefora backend problems missing in DryRun:', missing);
