import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const API_URL = process.env.API_URL;
export const NODE_ENV = process.env.NODE_ENV || "development";
