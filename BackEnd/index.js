const express = require("express");
const app = express();

require("./startup/config")();
require("./startup/db")();
require("./startup/routes")(app);
app.listen(5000, () => console.log("Listening to port 5000"));
