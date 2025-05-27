const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // No deprecated options
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to DB:', error.message);
        process.exit(1); // Exit if DB connection fails
    }
};

module.exports = connectDB;
