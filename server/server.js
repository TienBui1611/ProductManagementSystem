const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

// Import modified CRUD functions from App directory
const { getProductsForAPI } = require('../App/read.js');
const { addProductForAPI } = require('../App/add.js');
const { updateProductByObjectId } = require('../App/update.js');
const { removeProductByObjectId } = require('../App/remove.js');
const { initializeDatabase } = require('../App/create.js');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// (1) GET - List All Products
app.get('/products', async (req, res) => {
    try {
        const result = await getProductsForAPI();
        
        if (result.success) {
            res.json({
                success: true,
                count: result.data.length,
                data: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
        
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
});

// (2) POST - Add New Product (with duplicate ID check)
app.post('/products', async (req, res) => {
    try {
        const { id, name, description, price, units } = req.body;
        
        // Validate required fields
        if (!id || !name || !description || price === undefined || units === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: id, name, description, price, units'
            });
        }
        
        const result = await addProductForAPI(req.body);
        
        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Product added successfully',
                data: result.data
            });
        } else {
            const statusCode = result.error.includes('already exists') ? 409 : 500;
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
        
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add product'
        });
    }
});

// (3) DELETE - Remove Product by MongoDB ObjectID
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ObjectID format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ObjectID format'
            });
        }
        
        const result = await removeProductByObjectId(id);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Product deleted successfully',
                data: result.data
            });
        } else {
            const statusCode = result.error === 'Product not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
        
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product'
        });
    }
});

// (4) PUT/PATCH - Update Product by MongoDB ObjectID
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ObjectID format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ObjectID format'
            });
        }
        
        const result = await updateProductByObjectId(id, req.body);
        
        if (result.success) {
            res.json({
                success: true,
                message: result.message || 'Product updated successfully',
                data: result.data
            });
        } else {
            let statusCode = 500;
            if (result.error === 'Product not found') statusCode = 404;
            if (result.error.includes('already exists')) statusCode = 409;
            
            res.status(statusCode).json({
                success: false,
                error: result.error
            });
        }
        
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update product'
        });
    }
});


// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Product Management API',
        endpoints: {
            'GET /products': 'List all products',
            'POST /products': 'Add new product',
            'DELETE /products/:id': 'Delete product by MongoDB ObjectID',
            'PUT /products/:id': 'Update product by MongoDB ObjectID',
            'PATCH /products/:id': 'Update product by MongoDB ObjectID'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET    /products     - List all products');
    console.log('  POST   /products     - Add new product');
    console.log('  DELETE /products/:id - Delete product by ObjectID');
    console.log('  PUT    /products/:id - Update product by ObjectID');
});

module.exports = app;
