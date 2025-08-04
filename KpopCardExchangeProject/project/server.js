import express from "express";
import router from "./router/router.js";
import chalk from "chalk";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middlewares/errorHandler.js";
import { fileLogger } from "./middlewares/fileLogger.js";
import { errorLogger } from "./middlewares/errorLogger.js";
import { PORT } from "./services/env.service.js";
import { createInitialData } from "./services/initialData.service.js";
import { connectDB } from "./services/db.service.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
export const upload = multer({ storage });

app.use(express.json({ limit: "5mb" }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/", router);

app.use(fileLogger);
app.use(errorHandler);
app.use(errorLogger);
app.use("/uploads", express.static("uploads"));

const buildPath = path.join(__dirname, "..", "frontend", "build");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
    console.log(chalk.blue(`Server is running on port ${PORT}`));
    connectDB()
        .then(() => createInitialData())
        .catch((error) => {
            console.error(chalk.redBright(`Failed to connect to MongoDB: ${error.message}`));
            process.exit(1);
        });
});
