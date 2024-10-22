import dotenv from 'dotenv';

dotenv.config();

export const dbURL = process.env.DATABASE_URL;