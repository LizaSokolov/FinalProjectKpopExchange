import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        first: { type: String, required: true },
        middle: { type: String, default: "" },
        last: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    authLevel: { type: Number, default: 1 },
    notifications: [
        {
            type: { type: String, enum: ["trade_request", "trade_accepted"], required: true },
            cardId: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
            fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdAt: { type: Date, default: Date.now },
            read: { type: Boolean, default: false }
        }
    ],
    address: {
        country: { type: String, default: "" },
        state: { type: String, default: "" },
        city: { type: String, default: "" },
        street: { type: String, default: "" },
        houseNumber: { type: String, default: "" },
        zip: { type: String, default: "" }
    },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    favoriteGroups: [{ type: String }],
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
export { User };
