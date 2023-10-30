import { config } from 'dotenv';
config();
const configurations = {
    url: "http://localhost:3004",
    PORT: 3004,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
};

export default configurations;