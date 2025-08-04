import fs from "fs";
import path from "path";
import chalk from "chalk";

const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

export const fileLogger = (err, req, res, next) => {
    if (res.statusCode < 400) {
        return next();
    }

    const logDate = new Date().toISOString().split("T")[0];
    const logFile = path.join(logsDir, `${logDate}.log`);

    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode
        } | ${err.message}\n`;

    fs.appendFile(logFile, logMessage, (fsErr) => {
        if (fsErr) console.error(chalk.red("Error writing to log file:", fsErr));
    });

    next();
};
