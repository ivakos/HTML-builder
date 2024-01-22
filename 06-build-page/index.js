const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const directoryPath = path.join(__dirname, 'project-dist');

(async () => {
  await fsPromises.rm(directoryPath, { force: true, recursive: true });
  await fsPromises.mkdir(directoryPath);

  createHTML();

  mergeStyles();

  await fsPromises.mkdir(path.join(directoryPath, 'assets'));
  copyDirectory(
    path.join(__dirname, 'assets'),
    path.join(directoryPath, 'assets'),
  );
})();

async function createHTML() {
  const templateHTMLPath = path.join(__dirname, 'template.html');
  const componentsPath = path.join(__dirname, 'components');
  const stream = fs.createReadStream(templateHTMLPath, 'utf-8');
  let result = '';
  stream.on('data', (data) => (result += data));
  stream.on('end', async () => {
    let templates = result.match(/{{+\w+}}/gi);
    const files = await fsPromises.readdir(componentsPath, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (path.extname(file.name) !== '.html') {
        const nameFile = file.name.substr(0, file.name.lastIndexOf('.'));
        templates = templates.filter(
          (element) => element.slice(2, -2) !== nameFile,
        );
      }
    }
    for (let template of templates) {
      const file = await fsPromises.readFile(
        path.join(componentsPath, `${template.slice(2, -2)}.html`),
      );
      result = result.replace(template, file.toString());
    }
    await fsPromises.writeFile(path.join(directoryPath, 'index.html'), result);
  });
}

function mergeStyles() {
  const fromDir = path.join(__dirname, 'styles');
  const toDir = path.join(__dirname, 'project-dist');
  fs.unlink(toDir + '/' + 'bundle.css', () => {});
  fs.readdir(fromDir, (err, files) => {
    if (!err) {
      files.forEach((file) => {
        if (path.extname(file) === '.css') {
          const stream = new fs.ReadStream(fromDir + '/' + file, {
            encoding: 'utf-8',
          });
          stream.on('readable', function () {
            let data = stream.read();
            if (data != null) {
              fs.writeFile(
                toDir + '/' + 'style.css',
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
}

async function copyDirectory(fromDir, toDir) {
  const files = await fsPromises.readdir(fromDir, { withFileTypes: true });
  for (let i = 0; i < files.length; i++) {
    const fromFilePath = path.join(fromDir, files[i].name);
    const toFilePath = path.join(toDir, files[i].name);
    if (files[i].isFile()) {
      await fsPromises.copyFile(fromFilePath, toFilePath);
    } else {
      await fsPromises.mkdir(path.join(toDir, files[i].name));
      copyDirectory(fromFilePath, toFilePath);
    }
  }
}
