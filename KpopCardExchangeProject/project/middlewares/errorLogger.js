import fs from "fs";
import path from "path";
import chalk from "chalk";

export const errorLogger = (err, req, res, next) => {
    const logDirectory = path.join("logs");
    const logFilePath = path.join(logDirectory, `errors_${new Date().toISOString().slice(0, 10)}.log`);

    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }

    const errorLog = `[${new Date().toISOString()}] ERROR: ${err.message}\nStack: ${err.stack}\n\n`;

    fs.appendFileSync(logFilePath, errorLog);

    console.error(chalk.red(`Server Error: ${err.message}`));

    res.status(500).json({ error: "Internal Server Error" });
};
