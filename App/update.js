const { connectToDatabase, closeDatabaseConnection } = require('./app.js');

async function updateProduct(productId, updateData) {
    let client = null;
    
    try {
        // Connect to database
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        // Get the products collection
        const collection = db.collection('products');
        
        // Update the product by ID (using the custom id field, not MongoDB's _id)
        const result = await collection.updateOne(
            { id: productId },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            console.log(`No product found with ID: ${productId}`);
            return false;
        } else if (result.modifiedCount === 0) {
            console.log(`Product with ID ${productId} found but no changes were made`);
            return false;
        } else {
            console.log(`Successfully updated product with ID: ${productId}`);
            
            // Show the updated product
            const updatedProduct = await collection.findOne({ id: productId });
            console.log('Updated product details:');
            console.log(`  ID: ${updatedProduct.id}`);
            console.log(`  Name: ${updatedProduct.name}`);
            console.log(`  Description: ${updatedProduct.description}`);
            console.log(`  Price: $${updatedProduct.price}`);
            console.log(`  Units in Stock: ${updatedProduct.units}`);
            
            return true;
        }
        
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

// Example usage function
async function updateProductExample() {
    console.log('=== Updating Product Example ===');
    
    // Update product with ID 1 (Gaming Laptop)
    const updateData = {
        price: 1199.99,  // Reduced price
        units: 12,       // Updated stock
        description: "High-performance gaming laptop with RTX graphics - ON SALE!"
    };
    
    await updateProduct(1, updateData);
}

// Run the example if this file is executed directly
if (require.main === module) {
    updateProductExample();
}

// Export for use in Express routes (updates by MongoDB ObjectID)
async function updateProductByObjectId(objectId, updateData) {
    const { ObjectId } = require('mongodb');
    let client = null;
    
    try {
        const connection = await connectToDatabase();
        client = connection.client;
        const db = connection.db;
        
        const collection = db.collection('products');
        
        // Check if product exists
        const existingProduct = await collection.findOne({ _id: new ObjectId(objectId) });
        
        if (!existingProduct) {
            return { success: false, error: 'Product not found' };
        }
        
        // Check for duplicate ID if changing the custom ID
        if (updateData.id && updateData.id !== existingProduct.id) {
            const duplicateProduct = await collection.findOne({ 
                id: parseInt(updateData.id),
                _id: { $ne: new ObjectId(objectId) }
            });
            
            if (duplicateProduct) {
                return { 
                    success: false, 
                    error: `Product with ID ${updateData.id} already exists` 
                };
            }
        }
        
        // Prepare update object with validation
        const updateFields = {};
        
        if (updateData.id !== undefined) {
            updateFields.id = parseInt(updateData.id);
        }
        if (updateData.name !== undefined) {
            updateFields.name = updateData.name.substring(0, 50);
        }
        if (updateData.description !== undefined) {
            updateFields.description = updateData.description.substring(0, 255);
        }
        if (updateData.price !== undefined) {
            updateFields.price = parseFloat(parseFloat(updateData.price).toFixed(2));
        }
        if (updateData.units !== undefined) {
            updateFields.units = parseInt(updateData.units);
        }
        
        const result = await collection.updateOne(
            { _id: new ObjectId(objectId) },
            { $set: updateFields }
        );
        
        if (result.modifiedCount === 1) {
            const updatedProduct = await collection.findOne({ _id: new ObjectId(objectId) });
            return { success: true, data: updatedProduct };
        } else {
            return { success: true, message: 'No changes made', data: existingProduct };
        }
        
    } catch (error) {
        console.error('Error updating product by ObjectID:', error);
        return { success: false, error: error.message };
    } finally {
        if (client) {
            await closeDatabaseConnection(client);
        }
    }
}

module.exports = { updateProduct, updateProductByObjectId, updateProductExample };
