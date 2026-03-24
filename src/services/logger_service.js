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

const logEvent = (message) => {
    const logFile = getLogFileName();
    const time = new Date().toISOString();

    const logMessage = `[${time}] INFO: ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
};

const logError = (functionName, error) => {
    const logFile = getLogFileName();
    const time = new Date().toISOString();

    const logMessage = `[${time}] ERROR in ${functionName}: ${error.message}\n`;
    fs.appendFileSync(logFile, logMessage);
};

module.exports = { logEvent, logError };