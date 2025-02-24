import { config } from "dotenv";
config();

export const SERVER_URL = 'localhost';
export const PORT = 3000;
export const ENV = 'dev';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;