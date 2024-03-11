import mongoose from "mongoose";
import config from "../config/dotenvConfig.js";

const MONGO_USER = config.database.MONGO_USER;
const MONGO_PASSWORD = config.database.MONGO_PASSWORD;
const MONGO_URL = config.database.MONGO_URL;
const MONGO_DB_NAME = config.database.MONGO_DB_NAME

const connection = async () => {
    try {
        await mongoose.connect(MONGO_URL, {dbName:MONGO_DB_NAME });
        console.log("DataBase Conected");
    } catch (error) {
        console.log("Error en conect database");
        throw new Error("Can not connect to the database")
    }
}

export default connection;