const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (file.isFile()) {
        const fileInfo = path.join(folder, file.name);
        fs.stat(fileInfo, (err, stats) => {
          if (err) {
            console.error(err);
          }
          const fileName = file.name.substr(0, file.name.lastIndexOf('.'));
          const sizeOfFile = stats.size / 1024;
          console.log(
            fileName +
              ' - ' +
              path.extname(file.name) +
              ' - ' +
              sizeOfFile +
              ' kb',
          );
        });
      }
    });
  }
});
