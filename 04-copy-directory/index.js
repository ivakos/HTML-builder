const fsPromises = require('fs/promises');
const path = require('path');

const originalDir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

copyDirectory(originalDir, copyDir);

async function copyDirectory(fromDir, toDir) {
  await fsPromises.rm(toDir, { recursive: true, force: true }, () => {});
  await fsPromises.mkdir(toDir, () => {});
  const files = await fsPromises.readdir(fromDir);
  for (let i = 0; i < files.length; i++) {
    const fromFilePath = fromDir + '\\' + files[i];
    const toFilePath = toDir + '\\' + files[i];
    await fsPromises.copyFile(fromFilePath, toFilePath);
  }
}
