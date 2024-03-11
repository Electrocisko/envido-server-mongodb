import dotenv from 'dotenv';

dotenv.config();

export default {
    app: {
        PORT: process.env.PORT || 3000
    },
    database: {
        MONGO_USER: process.env.MONGO_USER,
        MONGO_PASSWORD: process.env.MONGO_PASSWORD,
        MONGO_URL: process.env.MONGO_URL,
        MONGO_DB_NAME: process.env.MONGO_DB_NAME
    },
    session: {
        ADMIN: process.env.ADMIN,
        PASS: process.env.PASS,
        SECRET_JWT: process.env.SECRET_JWT
    }
}