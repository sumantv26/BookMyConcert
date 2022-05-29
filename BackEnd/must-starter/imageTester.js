const fs = require("fs");
(async () => {
  const files = await fs.promises.readdir(`${__dirname}/../img/users`);
  for (const file of files) {
    const filename = "user-6258fa86dc0ceca8ce20ef04.jpeg";
    if (filename === file) {
      // console.log(file);
      await fs.unlink(`${__dirname}/../img/users/${file}`, (err) => {
        if (err) throw err;
        console.log("File Deleted");
      });
    }
  }
})();
