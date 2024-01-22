const { stdin, stdout } = process;
const fs = require('fs');

const stream = fs.createWriteStream('./02-write-file/text.txt');

stdout.write('Write text: \n');
stdin.on('data', (data) => {
  if (data.toString().indexOf('exit') === 0) {
    process.exit();
  }
  stream.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('Exit! Goodbye.'));
