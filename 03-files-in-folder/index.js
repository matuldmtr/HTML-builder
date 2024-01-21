const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (error, files) => {
  if (error) {
    console.log(error);
  } else {
    // console.log(files);

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);

        fs.stat(filePath, (error, stat) => {
          if (error) {
            console.log(error);
          } else {
            // console.log(stat);
            const fileInfo = path.parse(filePath);
            // console.log(fileInfo);
            const fileName = fileInfo.name;
            const fileExt = fileInfo.ext.slice(1);
            const fileSize = (stat.size / 1024).toFixed(1);

            console.log(`${fileName} - ${fileExt} - ${fileSize}kB`);
          }
        });
      }
    }
  }
});
