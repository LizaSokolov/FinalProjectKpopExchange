import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../models/User.schema.js";
import { createUserSchema } from "../validations/createUser.schema.js";
import { generateToken } from "../../services/auth.service.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import checkAuthLevel from "../../middlewares/checkAuthLevel.js";
import validate from "../../middlewares/validation.js";
import { validateLoginUser } from "../validations/loginUser.schema.js";
import upload from "../../middlewares/upload.js";
import { Message } from "../../messages/Message.schema.js";

const router = express.Router();

router.get("/public-users", isAuthenticated, async (req, res) => {
    try {
        const currentUserId = req.user._id || req.user.userId;

        const users = await User.find({
            _id: { $ne: currentUserId },
            authLevel: { $ne: 3 }
        }).select("name email _id avatar");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.get("/chat-contacts", isAuthenticated, async (req, res) => {
    try {
        const myId = req.user._id || req.user.userId;

        const messages = await Message.find({
            $or: [
                { sender: myId },
                { recipient: myId }
            ]
        }).select("sender recipient");

        const contactIds = new Set();

        messages.forEach(msg => {
            if (msg.sender.toString() !== myId.toString()) {
                contactIds.add(msg.sender.toString());
            }
            if (msg.recipient.toString() !== myId.toString()) {
                contactIds.add(msg.recipient.toString());
            }
        });

        const users = await User.find({
            _id: { $in: Array.from(contactIds) }
        }).select("name email _id avatar");

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat contacts" });
    }
});

router.patch("/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const notification = user.notifications.id(req.params.id);
        if (!notification) return res.status(404).json({ error: "Notification not found" });

        notification.read = true;
        await user.save();

        res.json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ error: "Error updating notification" });
    }
});

router.get("/", isAuthenticated, checkAuthLevel(3), async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.get("/me", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id || req.user.userId);
        if (!user) {
            console.log("User not found:", req.user._id || req.user.userId);
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Error fetching user" });
    }
});

router.post("/register", upload.single("avatar"), validate(createUserSchema), async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            ...req.body,
            password: hashedPassword,
            authLevel: 1
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ error: "Failed to register user" });
    }
});


router.post("/login", validateLoginUser, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const token = generateToken(user);
        res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/public/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("name avatar bio favoriteGroups")
            .populate("cards", "imageUrl name");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/notifications", isAuthenticated, async (req, res) => {
    const userId = req.user.userId;

    if (!userId) {
        return res.status(400).json({ error: "Missing user ID in token" });
    }

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    try {
        const user = await User.findById(userId).populate("notifications.fromUser", "name");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.notifications);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving notifications" });
    }
});

router.get("/:id", isAuthenticated, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await User.findById(req.params.id).select("name email _id");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

router.put("/:id", isAuthenticated, upload.single('avatar'), async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        if (req.user.userId !== req.params.id && req.user.authLevel < 3) {
            return res.status(403).json({ error: "Access denied" });
        }

        const updateData = {
            ...req.body,
            favoriteGroups: req.body.favoriteGroups ? req.body.favoriteGroups.split(",").map(s => s.trim()) : [],
        };

        if (req.file) {
            updateData.avatar = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

router.delete("/notifications/:id", isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId;
        const notificationId = req.params.id;

        await User.findByIdAndUpdate(userId, {
            $pull: { notifications: { _id: notificationId } },
        });

        res.json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete notification" });
    }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;

