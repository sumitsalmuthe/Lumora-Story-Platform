const app = require("../server");
const connectDB = require("../config/db");

let dbConnected = false;

const handler = async (req, res) => {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
      console.log("MongoDB Connected for Vercel");
    }

    return app(req, res);
  } catch (error) {
    console.error("Vercel API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      errors: [],
      data: null,
    });
  }
};

module.exports = handler;