const winston = require("winston")
const { createLogger,format, transports } = require('winston');
const { combine,colorize,simple, timestamp, label, printf } = format;

const consloeFomrat = printf(({ level, message, label, timestamp }) => {
    return `{${timestamp} [${label}] ${level}:${message}}`;
  });
const consoleConfig={
    format: combine(
      colorize(),
      simple(),
      timestamp(),
      consloeFomrat
    )
  }

  const myformat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  );
const logger = createLogger({
    transports: [
      new transports.File({ 
          filename: 'logfile.log',
          level: 'info',
          format: winston.format.json()
         })
    ],
    rejectionHandlers: [
      new transports.File({ filename: 'rejections.log' }),
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'exceptions.log' }),
      ],
      exitOnError:true
  });
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: myformat
    }));
}
  module.exports=logger