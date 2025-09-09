const { MongoClient } = require('mongodb');

// MongoDB connection URL and database configuration
const url = 'mongodb://localhost:27017';
const dbName = 'mydb';

// Function to get database connection
async function connectToDatabase() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log('Connected successfully to MongoDB server');
        
        const db = client.db(dbName);
        return { client, db };
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Function to close database connection
async function closeDatabaseConnection(client) {
    try {
        await client.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
}

// Function to drop the products collection (as required by the workshop)
async function dropProductsCollection() {
    const { client, db } = await connectToDatabase();
    
    try {
        const collection = db.collection('products');
        await collection.drop();
        console.log('Products collection dropped successfully');
    } catch (error) {
        if (error.code === 26) {
            console.log('Products collection does not exist, nothing to drop');
        } else {
            console.error('Error dropping products collection:', error);
        }
    } finally {
        await closeDatabaseConnection(client);
    }
}

module.exports = {
    connectToDatabase,
    closeDatabaseConnection,
    dropProductsCollection,
    dbName,
    url
};
