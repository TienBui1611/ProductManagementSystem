const { connectToDatabase, closeDatabaseConnection } = require('./app.js');

async function createDatabase() {
    let client = null;
    
    try {
        // Connect to database
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        // Get the products collection (MongoDB creates it implicitly when first document is inserted)
        const collection = db.collection('products');
        
        // Check if collection exists by trying to get collection stats
        try {
            const stats = await collection.stats();
            console.log(`Collection 'products' already exists with ${stats.count} documents`);
        } catch (error) {
            // Collection doesn't exist, create it by inserting a dummy document and removing it
            console.log(`Creating collection 'products'...`);
            
            const dummyDoc = { _temp: true };
            await collection.insertOne(dummyDoc);
            await collection.deleteOne({ _temp: true });
            
            console.log(`Collection 'products' created successfully`);
        }
        
        // List all collections to verify
        const collections = await db.listCollections().toArray();
        console.log('Available collections:');
        collections.forEach(col => {
            console.log(`  - ${col.name}`);
        });
        
        return { success: true, message: 'Database and collection ready' };
        
    } catch (error) {
        console.error('Error creating database/collection:', error);
        return { success: false, error: error.message };
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

// Export for use in Express routes
async function initializeDatabase() {
    let client = null;
    
    try {
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        const collection = db.collection('products');
        
        // Just verify the database and collection can be accessed
        await collection.findOne({});
        
        return { success: true, message: 'Database initialized' };
        
    } catch (error) {
        console.error('Error initializing database:', error);
        return { success: false, error: error.message };
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

// Run the function if this file is executed directly
if (require.main === module) {
    createDatabase();
}

module.exports = { createDatabase, initializeDatabase };
