import { Router } from "express";
import cardRoutes from "../cards/routes/Cards.routes.js"
import userRoutes from "../users/routes/User.routes.js";
import messageRoutes from "../messages/Messages.routes.js"

const router = Router();

router.use("/users", userRoutes);
router.use("/cards", cardRoutes);
router.use("/messages", messageRoutes);

router.use((req, res, next) => {
    next();
});

export default router;
