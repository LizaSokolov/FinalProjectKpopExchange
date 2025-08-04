import morgan from "morgan";
import chalk from "chalk";
import fs from "fs";
import path from "path";

const getLogFileName = () => {
    const date = new Date().toISOString().split("T")[0];
    return path.join("logs", `server_${date}.log`);
};

const logToFile = (message) => {
    const logFile = getLogFileName();

    if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs");
    }

    fs.appendFileSync(logFile, message + "\n", "utf8");
};

export const logger = morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const statusColor =
        status >= 400 ? chalk.red : status >= 300 ? chalk.yellow : chalk.green;

    const method = chalk.blue(tokens.method(req, res));
    const url = chalk.magenta(tokens.url(req, res));
    const date = chalk.cyan(new Date().toLocaleDateString());
    const time = chalk.cyan(new Date().toLocaleTimeString());
    const statusMessage = res.statusMessage || "Unknown error";

    const logMessage = `[${date} ${time}] ${method} ${url} - Status: ${status} - ${statusMessage}`;

    console.log(logMessage);

    if (status >= 400) {
        logToFile(logMessage);
    }

    return logMessage;
});
