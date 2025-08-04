import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        const db =
            process.env.ENV && process.env.ENV.trim().toLowerCase() === "dev"
                ? process.env.MONGO_LOCAL
                : process.env.MONGO_ATLAS;


        const name = db === process.env.MONGO_LOCAL ? "local" : "atlas";

        await mongoose.connect(db);
        console.log(chalk.greenBright(`Connected to MongoDB (${name})`));
    } catch (err) {
        console.error(chalk.redBright(`Error connecting to MongoDB: ${err.message}`));
        process.exit(1);
    }
};
