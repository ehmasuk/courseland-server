const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { dbName: "courseland" });
        console.log("Connected to the database");
    } catch (error) {
        console.log("Database connection error");
    }
};

module.exports = connectDb;
