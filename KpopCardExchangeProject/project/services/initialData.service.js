import { User } from "../users/models/User.schema.js";
import { Card } from "../cards/models/Cards.schema.js";
import bcrypt from "bcrypt";
import initialUsers from "../users/data/initialUsers.json" with { type: "json" };
import initialCards from "../cards/data/initialCards.json" with { type: "json" };

export const createInitialData = async () => {
    try {
        const usersFromDb = await User.find();
        if (usersFromDb.length === 0) {
            const hashedUsers = await Promise.all(
                initialUsers.map(async (user) => {
                    const hashedPassword = await bcrypt.hash(user.password, 10);
                    return { ...user, password: hashedPassword };
                })
            );
            await User.insertMany(hashedUsers);
            console.log("Initial users added successfully.");
        } else {
            console.log("Users already exist in the database.");
        }

        const existingCards = await Card.find();
        if (existingCards.length === 0) {
            let bizNumbers = new Set();

            const cardsWithBizNumbers = initialCards.map((card) => {
                let bizNumber;
                do {
                    bizNumber = Math.floor(100000 + Math.random() * 900000);
                } while (bizNumbers.has(bizNumber));

                bizNumbers.add(bizNumber);
                return { ...card, bizNumber };
            });

            await Card.insertMany(cardsWithBizNumbers);
            console.log("Initial cards added successfully.");
        } else {
            console.log("Cards already exist in the database.");
        }
    } catch (error) {
        console.error("Error creating initial data:", error.message);
    }
};
