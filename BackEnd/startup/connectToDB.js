const mongoose = require("mongoose");
// const config = require("config");
// const logger = require("./logger");

module.exports = () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STR)
    .then(() => console.log("SUCCESSFULLY CONNECTED TO DATABASE"))
    .catch((ex) => {
      console.error("Error: " + ex.message);
      throw new Error("can not connect to DATABASE.");
    });
};
