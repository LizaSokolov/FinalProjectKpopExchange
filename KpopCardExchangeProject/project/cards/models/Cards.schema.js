import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    idol: { type: String, required: true },
    group: { type: String, required: true },
    album: { type: String, required: true },
    imageUrl: { type: String, required: true },
    status: {
        type: String,
        enum: ["available", "pending", "traded"],
        default: "available"
    },
    tradeRequests: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            offeredCard: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
            message: { type: String }
        }
    ],
    logs: [
        {
            fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            offeredCard: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
            status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

const Card = mongoose.model("Card", cardSchema);
export { Card };
