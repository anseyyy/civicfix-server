const mongoose = require("mongoose");
require('dotenv').config();

const dbServer = process.env.dbServer;

mongoose.connect(dbServer, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log("Database connected to Server");
})
.catch(err => {
    console.error("Database Connection Failed:", err.message);
    console.error("Please check your IP Whitelist in MongoDB Atlas or your internet connection.");
});
