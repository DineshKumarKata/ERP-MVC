const mongoose = require('mongoose');
const env = require('dotenv');
env.config();

let count = 0;

const options = {
    maxPoolSize: 200,
	maxIdleTimeMS:1000,  //1 Seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 5000, // Give up server selection after 5 seconds
    heartbeatFrequencyMS: 10000, // Check server health every 10 seconds
};

const connectWithRetry = async () => {
    console.log('MongoDB connection with retry');
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, options);
        console.log(`MongoDB connected : ${process.env.MONGO_DB_URL}`);
    } catch (err) {
        console.log('MongoDB connection error:', err.message);
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000); // Wait 5 seconds before retrying
    }
};

// Handle connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected, attempting to reconnect...');
    connectWithRetry();
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
});

// Initial connection
connectWithRetry();

exports.mongoose = mongoose;
exports.connectWithRetry = connectWithRetry;
