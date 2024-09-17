const mongoose = require("mongoose");

async function connectMongoDB() {
 await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error(err));
};

module.exports = connectMongoDB;