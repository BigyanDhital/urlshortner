import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
      return `${level} ${timestamp} ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
          return `${timestamp} ${message}`;
        })
      ),
    }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

export { logger };
