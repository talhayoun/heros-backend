const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${level}] ${timestamp} ${message}`;
});

const logger = () => {
    return createLogger({
        format: combine(timestamp(), myFormat),
        transports: [
            new transports.File({ filename: 'logs/errors.log', level: "error" }),
            new transports.File({ filename: "logs/data.log", level: "info" })
        ]
    });
};

module.exports = logger;