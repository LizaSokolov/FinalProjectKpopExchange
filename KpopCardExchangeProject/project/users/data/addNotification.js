import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User.schema.js";
import { Card } from "../../cards/models/Cards.schema.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_ATLAS;

const addNotification = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const user = await User.findOne({ email: "jim@email.com" });
        if (!user) {
            console.log("❌ User not found");
            return;
        }

        const card = await Card.findOne({ idol: "Lisa" });
        if (!card) {
            console.log("❌ Card not found");
            return;
        }

        const newNotification = {
            type: "trade_request",
            message: "You've received a card trade offer!",
            fromUser: user._id,
            cardId: card._id,
            read: false,
            createdAt: new Date(),
        };

        user.notifications.push(newNotification);
        await user.save();

        console.log("✅ Notification added:", newNotification);
    } catch (error) {
        console.error("❌ Error adding notification:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
};

addNotification();
