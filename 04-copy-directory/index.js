const fs = require('fs/promises');
const path = require('path');

async function copyFolder() {
  const mainFolderPath = path.join(__dirname, 'files');
  const copyFolderPath = path.join(__dirname, 'files-copy');

  try {
    await fs.rm(copyFolderPath, { force: true, recursive: true });
    await fs.mkdir(copyFolderPath, { recursive: true });

    const files = await fs.readdir(mainFolderPath);
    // console.log(files);
    for (const file of files) {
      const mainFilePath = path.join(mainFolderPath, file);
      const copyFilePath = path.join(copyFolderPath, file);

      fs.copyFile(mainFilePath, copyFilePath);
    }
  } catch (error) {
    console.log(error);
  }
}

copyFolder();
