const mongoose = require('mongoose');
const dbConfig = require('../config/database');

class DatabaseManager {
  constructor() {
    this.connections = {};
  }

  async connect(dbName) {
    try {
      if (!this.connections[dbName]) {
        const config = dbConfig[dbName];
        if (!config) {
          throw new Error(`No configuration found for database: ${dbName}`);
        }

        const connection = await mongoose.createConnection(config.uri, config.options);
        
        // Set up connection event handlers
        connection.on('connected', () => {
          console.log(`Successfully connected to ${dbName} database`);
        });

        connection.on('error', (err) => {
          console.error(`${dbName} database connection error:`, err);
        });

        connection.on('disconnected', () => {
          console.log(`${dbName} database disconnected`);
        });

        this.connections[dbName] = connection;
      }

      return this.connections[dbName];
    } catch (error) {
      console.error(`Error connecting to ${dbName} database:`, error);
      throw error;
    }
  }

  async closeConnection(dbName) {
    try {
      if (this.connections[dbName]) {
        await this.connections[dbName].close();
        delete this.connections[dbName];
        console.log(`${dbName} database connection closed`);
      }
    } catch (error) {
      console.error(`Error closing ${dbName} database connection:`, error);
      throw error;
    }
  }

  async closeAllConnections() {
    try {
      await Promise.all(
        Object.keys(this.connections).map(dbName => this.closeConnection(dbName))
      );
      console.log('All database connections closed');
    } catch (error) {
      console.error('Error closing all database connections:', error);
      throw error;
    }
  }

  getConnection(dbName) {
    return this.connections[dbName];
  }

  getAllConnections() {
    return this.connections;
  }
}

// Create and export a singleton instance
const dbManager = new DatabaseManager();
module.exports = dbManager; 