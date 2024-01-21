const fs = require('fs');
const path = require('path');

const mainFolderPath = path.join(__dirname, 'styles');
const distFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

const writeStream = fs.createWriteStream(distFilePath);

fs.readdir(mainFolderPath, { withFileTypes: true }, (error, files) => {
  if (error) console.log(error);

  //   console.log(files);

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(mainFolderPath, file.name);
      const fileExt = path.extname(filePath);

      //   console.log(filePath);
      console.log(fileExt);

      if (fileExt === '.css') {
        const readStream = fs.createReadStream(filePath);

        readStream.pipe(writeStream);
      }
    }
  }
});
