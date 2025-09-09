const { connectToDatabase, closeDatabaseConnection } = require('./app.js');

async function removeProduct(productId) {
    let client = null;
    
    try {
        // Connect to database
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        // Get the products collection
        const collection = db.collection('products');
        
        // First, find the product to show what we're deleting
        const productToDelete = await collection.findOne({ id: productId });
        
        if (!productToDelete) {
            console.log(`No product found with ID: ${productId}`);
            return false;
        }
        
        // Delete the product by ID (using the custom id field, not MongoDB's _id)
        const result = await collection.deleteOne({ id: productId });
        
        if (result.deletedCount === 1) {
            console.log(`Successfully deleted product:`);
            console.log(`  ID: ${productToDelete.id}`);
            console.log(`  Name: ${productToDelete.name}`);
            console.log(`  Price: $${productToDelete.price}`);
            return true;
        } else {
            console.log(`Failed to delete product with ID: ${productId}`);
            return false;
        }
        
    } catch (error) {
        console.error('Error removing product:', error);
        return false;
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

// Function to remove product by MongoDB ObjectID (alternative method)
async function removeProductByObjectId(objectId) {
    const { ObjectId } = require('mongodb');
    let client = null;
    
    try {
        // Connect to database
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        // Get the products collection
        const collection = db.collection('products');
        
        // First, find the product to show what we're deleting
        const productToDelete = await collection.findOne({ _id: new ObjectId(objectId) });
        
        if (!productToDelete) {
            console.log(`No product found with ObjectID: ${objectId}`);
            return false;
        }
        
        // Delete the product by MongoDB ObjectID
        const result = await collection.deleteOne({ _id: new ObjectId(objectId) });
        
        if (result.deletedCount === 1) {
            console.log(`Successfully deleted product:`);
            console.log(`  MongoDB ID: ${productToDelete._id}`);
            console.log(`  ID: ${productToDelete.id}`);
            console.log(`  Name: ${productToDelete.name}`);
            console.log(`  Price: $${productToDelete.price}`);
            return true;
        } else {
            console.log(`Failed to delete product with ObjectID: ${objectId}`);
            return false;
        }
        
    } catch (error) {
        console.error('Error removing product by ObjectID:', error);
        return false;
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

// Example usage function
async function removeProductExample() {
    console.log('=== Removing Product Example ===');
    
    // Remove product with ID 4 (Bluetooth Speaker)
    await removeProduct(4);
}

// Run the example if this file is executed directly
if (require.main === module) {
    removeProductExample();
}

// Export for use in Express routes (removes by MongoDB ObjectID)
async function removeProductByObjectId(objectId) {
    const { ObjectId } = require('mongodb');
    let client = null;
    
    try {
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        const collection = db.collection('products');
        
        // Find the product first
        const productToDelete = await collection.findOne({ _id: new ObjectId(objectId) });
        
        if (!productToDelete) {
            return { success: false, error: 'Product not found' };
        }
        
        // Delete by MongoDB ObjectID
        const result = await collection.deleteOne({ _id: new ObjectId(objectId) });
        
        if (result.deletedCount === 1) {
            return { success: true, data: productToDelete };
        } else {
            return { success: false, error: 'Failed to delete product' };
        }
        
    } catch (error) {
        console.error('Error removing product by ObjectID:', error);
        return { success: false, error: error.message };
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

module.exports = { removeProduct, removeProductByObjectId, removeProductExample };
