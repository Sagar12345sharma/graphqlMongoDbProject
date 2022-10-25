const mongoose = require("mongoose");

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.MONGO_DB_URI);
  console.log("mongo-db connection completed".cyan.underline.bgMagenta);
};

module.exports = connectDB;
