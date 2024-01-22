const fs = require('fs');
const path = require('path');

const fromDir = path.resolve('./05-merge-styles/styles');
const toDir = path.resolve('./05-merge-styles/project-dist');

fs.unlink(toDir + '/' + 'bundle.css', (err) => {
  if (err) {
    console.log('File bundle.css has been created.');
  } else {
    console.log('File bundle.css is overwritten.');
  }
});

fs.readdir(fromDir, (err, files) => {
  if (!err) {
    files.forEach((file) => {
      if (path.extname(file) == '.css') {
        const stream = new fs.ReadStream(fromDir + '/' + file, {
          encoding: 'utf-8',
        });
        stream.on('readable', function () {
          let data = stream.read();
          if (data != null) {
            fs.writeFile(
              toDir + '/' + 'bundle.css',
              data,
              { flag: 'a+' },
              (err) => {
                if (err) console.log('error');
              },
            );
          }
        });
      }
    });
  }
});
