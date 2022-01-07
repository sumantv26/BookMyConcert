const mongoose = require("mongoose");
const config = require("config");
const logger = require("./logger");

module.exports = () => {
  mongoose
    .connect(config.get("db"))
    .then(() => logger.info(`connected to mongodb at ${config.get("db")}`))
    .catch((ex) => {
      logger.error("db: " + ex.message);
      throw new Error("can not connect to DB.");
    });
};
