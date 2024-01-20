const fs = require('fs');
const path = require('path');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

stream.on('data', (chunk) => {
  console.log(chunk);
});

stream.on('end', (chunk) => {
  console.log(`Reading file "${path.basename(__filename)}" is completed!`);
});

stream.on('error', (error) => {
  console.log('Error', error.message);
});
