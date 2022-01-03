const config = require("config");
const moment = require("moment");

module.exports = () => {
  if (!(config.get("db") && config.get("jwtKey"))) {
    throw new Error("Environment variable is missing db/jwtKey");
  }
};
