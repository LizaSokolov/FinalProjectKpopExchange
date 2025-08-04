import mongoose from "mongoose";
import { User } from "./models/User.schema.js";

const updateUsers = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/yourDatabaseName", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const result = await User.updateMany({}, { $set: { "name.first": "Default", "name.last": "User" } });
        console.log("Updated users:", result);
        mongoose.disconnect();
    } catch (error) {
        console.error("Error updating users:", error);
    }
};

updateUsers();
