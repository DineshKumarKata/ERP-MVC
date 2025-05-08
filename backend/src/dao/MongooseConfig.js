const mongoose = require('mongoose');
const env = require('dotenv');
const { admissionDB, academicDB, financeDB } = require('../config/dbConnections');
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

// Handle connection events for admission database
admissionDB.on('error', err => {
    console.error('Admission DB connection error:', err);
});

admissionDB.on('disconnected', () => {
    console.log('Admission DB disconnected');
});

admissionDB.on('connected', () => {
    console.log('Admission DB connected successfully');
});

// Handle connection events for academic database
academicDB.on('error', err => {
    console.error('Academic DB connection error:', err);
});

academicDB.on('disconnected', () => {
    console.log('Academic DB disconnected');
});

academicDB.on('connected', () => {
    console.log('Academic DB connected successfully');
});

// Handle connection events for finance database
financeDB.on('error', err => {
    console.error('Finance DB connection error:', err);
});

financeDB.on('disconnected', () => {
    console.log('Finance DB disconnected');
});

financeDB.on('connected', () => {
    console.log('Finance DB connected successfully');
});

// Initial connection
connectWithRetry();

module.exports = {
    admissionDB,
    academicDB
};