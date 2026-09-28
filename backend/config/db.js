const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not configured");
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    );

    return conn.connection;
  } catch (error) {
    console.error(
      "MongoDB Error:",
      error.message
    );

    throw error;
  }
};

module.exports = connectDB;