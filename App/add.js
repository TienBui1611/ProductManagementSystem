const { connectToDatabase, closeDatabaseConnection } = require('./app.js');

// Sample products data
const products = [
    {
        id: 1,
        name: "Gaming Laptop",
        description: "High-performance laptop for gaming and professional work",
        price: 1299.99,
        units: 15
    },
    {
        id: 2,
        name: "Wireless Headphones",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery",
        price: 249.99,
        units: 45
    },
    {
        id: 3,
        name: "Smartphone",
        description: "Latest flagship smartphone with advanced camera system",
        price: 899.99,
        units: 25
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        description: "Portable waterproof speaker with excellent sound quality",
        price: 79.99,
        units: 60
    }
];

async function addProducts() {
    let client = null;
    
    try {
        // Connect to database (assumes database/collection already initialized by create.js)
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        // Get the products collection
        const collection = db.collection('products');
        
        // Drop the products collection before adding new data (as required by workshop)
        try {
            await collection.drop();
            console.log('Products collection dropped successfully');
        } catch (error) {
            if (error.code === 26) {
                console.log('Products collection does not exist, nothing to drop');
            } else {
                throw error;
            }
        }
        
        // Insert the products
        const result = await collection.insertMany(products);
        
        console.log(`Successfully added ${result.insertedCount} products to the database:`);
        products.forEach((product, index) => {
            console.log(`- ${product.name} (ID: ${product.id}, Price: $${product.price})`);
        });
        
    } catch (error) {
        console.error('Error adding products:', error);
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

// Run the function if this file is executed directly
if (require.main === module) {
    addProducts();
}

// Export for use in Express routes
async function addProductForAPI(productData) {
    let client = null;
    
    try {
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        const collection = db.collection('products');
        
        // Check for duplicate ID
        const existingProduct = await collection.findOne({ id: productData.id });
        if (existingProduct) {
            return { 
                success: false, 
                error: `Product with ID ${productData.id} already exists` 
            };
        }
        
        // Validate and format the product data
        const newProduct = {
            id: parseInt(productData.id),
            name: productData.name.substring(0, 50), // Limit to 50 characters
            description: productData.description.substring(0, 255), // Limit to 255 characters
            price: parseFloat(parseFloat(productData.price).toFixed(2)), // 2 decimal places
            units: parseInt(productData.units)
        };
        
        const result = await collection.insertOne(newProduct);
        return { 
            success: true, 
            data: { ...newProduct, _id: result.insertedId } 
        };
        
    } catch (error) {
        console.error('Error adding product:', error);
        return { success: false, error: error.message };
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

module.exports = { addProducts, addProductForAPI, products };
