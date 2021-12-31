const express = require("express");

const app = require("./startup/app");

require("./startup/config")();
require("./startup/db")();
// require("./startup/app")();

app.listen(5000, () => console.log("Listening to port 5000"));
