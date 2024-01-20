const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath);

stdout.write('\nEnter you text. To exit enter "exit" or press "ctrl + C"\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') exit();
  writeStream.write(data.toString());
});

process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('\nFinish\n'));
