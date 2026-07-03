require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const initBackgroundWorker = require("./utils/reminderWorker");

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Start background reminders safely once server is active
    initBackgroundWorker();
});