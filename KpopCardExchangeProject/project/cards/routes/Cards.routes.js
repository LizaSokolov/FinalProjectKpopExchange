import express from "express";
import { Card } from "../models/Cards.schema.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { User } from "../../users/models/User.schema.js"
import { Message } from "../../messages/Message.schema.js";
import mongoose from "mongoose";
import upload from "../../middlewares/upload.js";

const router = express.Router();

router.post("/add", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
        const { idol, group, album } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
        const newCard = new Card({
            owner: req.user._id || req.user.userId,
            idol,
            group,
            album,
            imageUrl,
        });

        await newCard.save();
        res.status(201).json({ message: "Card added successfully!", card: newCard });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const cards = await Card.find({ status: "available" })
            .populate("owner", "name address");
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving cards." });
    }
});


router.post("/trade/:cardId", isAuthenticated, async (req, res) => {
    try {

        const { offeredCardId, message } = req.body;
        const card = await Card.findById(req.params.cardId);
        if (!card) return res.status(404).json({ error: "Card not found." });

        card.tradeRequests.push({
            user: req.user.userId,
            offeredCard: offeredCardId,
            message
        });

        await card.save();

        await User.findByIdAndUpdate(card.owner, {
            $push: {
                notifications: {
                    type: "trade_request",
                    cardId: card._id,
                    fromUser: req.user.userId
                }
            }
        });

        res.json({ message: "Trade request sent!", card });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post("/trade/accept/:cardId/:requestId", isAuthenticated, async (req, res) => {
    try {

        const userId = req.user._id || req.user.userId;
        if (!userId) {
            return res.status(401).json({ error: "Invalid or missing user information from token" });
        }

        const { cardId, requestId } = req.params;

        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ error: "Card not found." });
        }

        const request = card.tradeRequests.id(requestId);
        if (!request) {
            return res.status(404).json({ error: "Trade request not found." });
        }
        await User.findByIdAndUpdate(card.owner, {
            $push: {
                tradeHistory: {
                    cardId,
                    tradedWith: request.user,
                    receivedCard: request.offeredCard
                }
            }
        });

        await User.findByIdAndUpdate(request.user, {
            $push: {
                tradeHistory: {
                    cardId: request.offeredCard,
                    tradedWith: card.owner,
                    receivedCard: cardId
                }
            }
        });

        await User.findByIdAndUpdate(request.user, {
            $push: {
                notifications: {
                    type: "trade_accepted",
                    cardId,
                    fromUser: userId
                }
            }
        });

        await Message.create({
            sender: userId,
            recipient: request.user,
            content: `Hi! Want to change?`,
        });

        card.status = "traded";
        card.tradeRequests = [];
        await card.save();

        res.json({ message: "Trade accepted! Chat started.", card });
    } catch (error) {
        res.status(500).json({ error: "Error accepting trade." });
    }
});


router.get("/my-cards", isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId;

        const myCards = await Card.find({ owner: userId })
            .populate("owner", "name email")
            .populate("tradeRequests.user", "name email")
            .populate("tradeRequests.offeredCard", "idol group imageUrl");

        res.json(myCards);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving your cards." });
    }
});

router.delete("/trade/reject/:cardId/:requestId", isAuthenticated, async (req, res) => {
    try {
        const { cardId, requestId } = req.params;
        const userId = (req.user._id || req.user.userId)?.toString();

        const card = await Card.findById(cardId);
        if (!card) return res.status(404).json({ error: "Card not found" });

        if (card.owner.toString() !== userId) {
            return res.status(403).json({ error: "Only the card owner can reject trade requests" });
        }

        const objectId = new mongoose.Types.ObjectId(requestId);
        const existing = card.tradeRequests.id(objectId);

        if (!existing) {
            return res.status(404).json({ error: "Trade request not found" });
        }

        card.tradeRequests.pull({ _id: objectId });
        await card.save();

        res.json({ message: "Trade request rejected", card });
    } catch (error) {
        res.status(500).json({ error: "Error rejecting trade request" });
    }
});

router.get("/:id", isAuthenticated, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ error: "Card not found" });
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: "Error fetching card" });
    }
});

router.put("/:id", isAuthenticated, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);

        if (!card) {
            return res.status(404).json({ error: "Card not found" });
        }

        if (!card.owner) {
            return res.status(500).json({ error: "Card has no owner information" });
        }

        const ownerId = card.owner.toString();
        const userId = req.user._id?.toString() || req.user.userId?.toString();

        if (ownerId !== userId) {
            return res.status(403).json({ error: "Not authorized to edit this card" });
        }

        card.idol = req.body.idol;
        card.group = req.body.group;
        card.album = req.body.album;
        card.imageUrl = req.body.imageUrl;

        await card.save();
        res.json({ message: "Card updated", card });

    } catch (error) {
        res.status(500).json({ error: "Error updating card" });
    }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id || req.user.userId;
        const card = await Card.findById(req.params.id);

        if (!card) return res.status(404).json({ error: "Card not found" });

        if (card.owner.toString() !== userId.toString()) {
            return res.status(403).json({ error: "You are not allowed to delete this card" });
        }

        await card.deleteOne();

        res.json({ message: "Card deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting card" });
    }
});

export default router;
