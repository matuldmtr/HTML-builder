const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const templateFilePath = path.join(__dirname, 'template.html');
const componentsFolderPath = path.join(__dirname, 'components');
const distFolderPath = path.join(__dirname, 'project-dist');
const indexFilePath = path.join(distFolderPath, 'index.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const distStyleFilePath = path.join(__dirname, 'project-dist', 'style.css');
const assentsSourcePath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(__dirname, 'project-dist', 'assets');

let templateContent;
let components = [];

async function getComponents() {
  templateContent = await fsPromises.readFile(templateFilePath, 'utf8');
  const regEx = /{{(.*?)}}/g;
  let componentsData;

  while ((componentsData = regEx.exec(templateContent))) {
    components.push(componentsData[1]);
  }
  //   console.log(components);
}

async function replaceContent(components) {
  for (const component of components) {
    const componentFilePath = path.join(
      componentsFolderPath,
      `${component}.html`,
    );
    const componentContent = await fsPromises.readFile(
      componentFilePath,
      'utf8',
    );
    templateContent = templateContent.replace(
      `{{${component}}}`,
      componentContent,
    );
  }
}

async function saveEditedContent() {
  await fsPromises.rm(distFolderPath, { force: true, recursive: true });
  await fsPromises.mkdir(distFolderPath, { recursive: true });
  await fsPromises.writeFile(indexFilePath, templateContent, 'utf8');
}

async function createMainCSSFile() {
  const cssFiles = await fsPromises.readdir(stylesFolderPath, {
    withFileTypes: true,
  });

  const writeStream = fs.createWriteStream(distStyleFilePath, {
    encoding: 'utf8',
  });

  for (const file of cssFiles) {
    if (file.isFile()) {
      const filePath = path.join(stylesFolderPath, file.name);
      const fileExt = path.extname(filePath);

      if (fileExt === '.css') {
        const readStream = fs.createReadStream(filePath);

        readStream.pipe(writeStream);
      }
    }
  }
}

async function copyAssets(sourcePath, distPath) {
  await fsPromises.mkdir(distPath, { recursive: true });

  const files = await fsPromises.readdir(sourcePath);

  files.forEach(async (fileName) => {
    const fileSourcePath = path.join(sourcePath, fileName);
    const fileDistPath = path.join(distPath, fileName);
    const fileStat = await fsPromises.stat(fileSourcePath);

    if (fileStat.isDirectory()) {
      await copyAssets(fileSourcePath, fileDistPath);
    } else {
      await fs.promises.copyFile(fileSourcePath, fileDistPath);
    }
  });
}

async function init() {
  try {
    await getComponents();
    await replaceContent(components);
    await saveEditedContent();
    await createMainCSSFile();
    await copyAssets(assentsSourcePath, assetsDistPath);
  } catch (error) {
    console.log(error);
  }
}

init();
