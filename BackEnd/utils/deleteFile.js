const fs = require("fs");
const deleteFile = async (filePath, fileName) => {
  const files = await fs.promises.readdir(filePath);
  for (const file of files) {
    if (fileName === file) {
      await fs.unlink(`${filePath}/${file}`, (err) => {
        if (err) throw err;
        console.log("File Deleted");
      });
    }
  }
};

module.exports = deleteFile;
