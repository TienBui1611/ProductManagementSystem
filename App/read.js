const { connectToDatabase, closeDatabaseConnection } = require('./app.js');

async function readProducts() {
    let client = null;
    
    try {
        // Connect to database
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        // Get the products collection
        const collection = db.collection('products');
        
        // Find all products
        const products = await collection.find({}).toArray();
        
        console.log('\n=== All Products in Database ===');
        
        if (products.length === 0) {
            console.log('No products found in the database.');
        } else {
            console.log(`Found ${products.length} products:\n`);
            
            products.forEach((product, index) => {
                console.log(`Product ${index + 1}:`);
                console.log(`  MongoDB ID: ${product._id}`);
                console.log(`  ID: ${product.id}`);
                console.log(`  Name: ${product.name}`);
                console.log(`  Description: ${product.description}`);
                console.log(`  Price: $${product.price}`);
                console.log(`  Units in Stock: ${product.units}`);
                console.log('  ---');
            });
        }
        
        return products;
        
    } catch (error) {
        console.error('Error reading products:', error);
        return [];
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

// Run the function if this file is executed directly
if (require.main === module) {
    readProducts();
}

// Export for use in Express routes
async function getProductsForAPI() {
    let client = null;
    
    try {
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        const collection = db.collection('products');
        const products = await collection.find({}).toArray();
        
        return { success: true, data: products };
        
    } catch (error) {
        console.error('Error reading products:', error);
        return { success: false, error: error.message };
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

module.exports = { readProducts, getProductsForAPI };
