const winston = require("winston")
const logger = require("../startup/logger")

module.exports=(err,req,res,next)=>{
    // winston.error(err.message,err)
    logger.error(err.message,err)
    res.status(400).send("server error!")
}