import dotenv from 'dotenv';
dotenv.config();

const dbName = 'home_works';

export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  PORT2: process.env.PORT || 3999,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
  MONGO_URL2: process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`,
  DB_NAME: process.env.DB_NAME || 'lessons',
  EMAIL: process.env.MY_EMAIL,
  PASS: process.env.MY_PASS,
};
