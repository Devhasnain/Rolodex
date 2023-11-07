import { config } from 'dotenv';
config();
const configurations = {
    url: "https://rolodex-production-81e1.up.railway.app",
    PORT: 3004,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
};

export default configurations;