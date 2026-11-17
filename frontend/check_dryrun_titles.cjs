const fs = require('fs');

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
console.log(titleMatches2.join(', '));
