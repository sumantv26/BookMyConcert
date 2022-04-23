const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(process.env.DB_CONNECTION_STR)
    .then(() => console.log("SUCCESSFULLY CONNECTED TO DATABASE"))
    .catch((ex) => {
      console.error("Error: " + ex.message);
      throw new Error("can not connect to DATABASE.");
    });
};
