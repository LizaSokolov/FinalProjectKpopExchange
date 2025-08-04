import express from "express";
import { Message } from "./Message.schema.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { validateMessage } from "./validateMessage.schema.js";

const router = express.Router();

router.get("/:userId", isAuthenticated, async (req, res) => {
    try {
        const myId = req.user._id || req.user.userId;
        const otherUserId = req.params.userId;

        await Message.updateMany(
            { sender: otherUserId, recipient: myId, read: false },
            { $set: { read: true } }
        );

        const messages = await Message.find({
            $or: [
                { sender: myId, recipient: otherUserId },
                { sender: otherUserId, recipient: myId },
            ],
        })
            .sort({ timestamp: 1 })
            .populate("sender");

        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Error fetching messages" });
    }
});

router.get("/unread/count", isAuthenticated, async (req, res) => {
    try {
        const myId = req.user._id || req.user.userId;
        const count = await Message.countDocuments({ recipient: myId, read: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: "Error fetching unread messages count" });
    }
});

router.post("/mark-read/:userId", isAuthenticated, async (req, res) => {
    try {
        const myId = req.user._id || req.user.userId;
        const otherUserId = req.params.userId;

        await Message.updateMany(
            { sender: otherUserId, recipient: myId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ error: "Failed to mark messages as read" });
    }
});


router.post("/", isAuthenticated, async (req, res) => {
    try {
        const { error } = validateMessage(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { recipient, content } = req.body;

        const senderId = req.user._id || req.user.userId;
        if (!senderId) {
            return res.status(401).json({ error: "Unauthorized: sender ID missing" });
        }

        const message = new Message({
            sender: senderId,
            recipient,
            content,
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: "Error sending message" });
    }
});


export default router;
