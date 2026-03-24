const fs = require("fs");
const path = require('path');

const getLogFileName = () => {
    const logDir = path.join(__dirname, "../logs");

    if(!fs.existsSync(logDir)){
        fs.mkdirSync(logDir);
    }

    const date = new Date().toISOString().split("T")[0];
    return path.join(logDir, `${date}.log`);
};

const writeLog = (level, message) => {
    const logFile = getLogFileName();
    const time = new Date().toISOString();

    const logMessage = `[${time}] ${level}: ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
};

const log = {
    info: (msg) => writeLog("INFO", msg),
    error: (msg) => writeLog("ERROR", msg),
    success: (msg) => writeLog("SUCCESS", msg),
    warn: (msg) => writeLog("WARNING", msg)
};

module.exports = log;

// const logEvent = (message) => {

//     const logFile = getLogFileName();
//     const time = new Date().toISOString();

//     const logMessage = `[${time}] INFO: ${message}\n`;
//     fs.appendFileSync(logFile, logMessage);
// };

// const logError = (functionName, error) => {
//     const logFile = getLogFileName();
//     const time = new Date().toISOString();

//     const logMessage = `[${time}] ERROR in ${functionName}: ${error.message}\n`;
//     fs.appendFileSync(logFile, logMessage);
// };

// module.exports = { logEvent, logError };