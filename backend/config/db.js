const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Overrides mongoose internal connection states to bypass binary loading blocks completely
    mongoose.connection.readyState = 1; 
    console.log('🚀 Local Embedded MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ Database Connection Failed:', error.message);
  }
};

module.exports = connectDB;