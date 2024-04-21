// routes/products.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // make sure the path to db.js is correct
const authorization = require("../middleware/authorization");


async function logInventoryAction(actionType, userId, logType, changeDetails) {
    const logQuery = `
        INSERT INTO log (action_type, user_id, log_type, change_details) 
        VALUES ($1, $2, $3, $4);
    `;
    try {
        await pool.query(logQuery, [actionType, userId, logType, JSON.stringify(changeDetails)]);
    } catch (err) {
        console.error('Failed to log inventory action:', err.message);
    }
}

router.get('/', authorization, async (req, res) => {
    try {
        const products = await pool.query(`
        SELECT * FROM products
        `);
        res.json({products});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authorization, async (req, res) => {
    try {
        // Extracting fields from req.body based on the structure provided earlier
        const {
            partNumber,      // Maps to 'part_number'
            supplierPartNumber,
            radiusSize,      // Originally 'size', now correctly mapped to 'radius_size'
            materialType,    // Maps to 'material_type'
            color,           // New addition, maps to 'color'
            description,     // Maps to 'description'
            type,            // Maps to 'type'
            quantityOfItem,  // Maps to 'quantity_of_item', adjusted for decimal type
            unit,            // Maps to 'unit'
            price,           // Maps to 'price', note: handling MONEY type correctly is important
            markUpPrice,      // Maps to 'mark_up_price', same note on MONEY type
        } = req.body;

        if (!partNumber || !price || !supplierPartNumber || !materialType || !description || !type || !quantityOfItem) { // Add more required fields as necessary
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure the SQL query matches your database schema
        const newProduct = await pool.query(`
        INSERT INTO products (
            part_number,
            supplier_part_number,
            radius_size, 
            material_type, 
            color, 
            description, 
            type, 
            quantity_of_item, 
            unit, 
            price, 
            mark_up_price
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
        `, [partNumber, supplierPartNumber, radiusSize, materialType, color, description, type, quantityOfItem, unit, price, markUpPrice]);

        await pool.query(`
            INSERT INTO inventory (part_number, quantity_in_stock)
            VALUES ($1, $2) RETURNING *;
        `, [partNumber, 0]); // Use the partNumber from req.body and a default quantity of 0
        
        // After inserting the new product and before sending the response
        await logInventoryAction('Add Product', req.username, 'inventory', { 
            message: 'Product Added', 
            details: { ...req.body } 
        });

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        // Handling unique constraint violation
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Duplicate entry', details: err.detail });
        }
        res.status(500).json({ error: 'Internal server error', message: err.message });
    }
});

router.delete('/:partNumber', authorization, async (req, res) => {
    try {
        const { partNumber } = req.params;

        // First, delete any related inventory records for the product to avoid foreign key constraints.
        // This assumes that `part_number` is used as a reference in your `inventory` table.
        const inventoryDeletionResponse = await pool.query(`
            DELETE FROM inventory
            WHERE part_number = $1;
        `, [partNumber]);

        // Then, delete the product from the products table.
        const productDeletionResponse = await pool.query(`
            DELETE FROM products
            WHERE part_number = $1
            RETURNING *;
        `, [partNumber]);
        
        // After deleting the product and before sending the response
        await logInventoryAction('Delete Product', req.username, 'inventory', { 
            message: 'Product Deleted',
            details: productDeletionResponse.rows[0]
        });

        // Check if a product was actually deleted. If not, the product was not found.
        if (productDeletionResponse.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            message: 'Product and associated inventory records deleted successfully',
            deletedProduct: productDeletionResponse.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

router.put('/:originalPartNumber', authorization, async (req, res) => {
    const client = await pool.connect();
    try {
        const { originalPartNumber } = req.params;
        const {
            partNumber,   // New part number to update
            supplierPartNumber,
            radiusSize,      // Maps to 'radius_size'
            materialType,    // Maps to 'material_type'
            color,           // Maps to 'color'
            description,     // Maps to 'description'
            type,            // Maps to 'type'
            oldType,
            quantityOfItem,  // Maps to 'quantity_of_item'
            unit,            // Maps to 'unit'
            price,           // Maps to 'price'
            markUpPrice,      // Maps to 'mark_up_price'
            catCode
        } = req.body;

        // Begin transaction
        await client.query('BEGIN');
        if (partNumber === originalPartNumber) {
            // Update existing product details
            const updateProductQuery = `
                UPDATE products
                SET 
                    supplier_part_number = $1,
                    radius_size = $2, 
                    material_type = $3, 
                    color = $4, 
                    description = $5, 
                    type = $6, 
                    quantity_of_item = $7, 
                    unit = $8, 
                    price = $9, 
                    mark_up_price = $10
                WHERE part_number = $11;
            `;
            await client.query(updateProductQuery, [supplierPartNumber, radiusSize, materialType, color, description, type, quantityOfItem, unit, price, markUpPrice, originalPartNumber]);
        } else {
            // Insert new product details with the new part number
            const insertProductQuery = `
                INSERT INTO products (part_number, supplier_part_number, radius_size, material_type, color, description, type, quantity_of_item, unit, price, mark_up_price)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
            `;
            await client.query(insertProductQuery, [partNumber, supplierPartNumber, radiusSize, materialType, color, description, type, quantityOfItem, unit, price, markUpPrice]);

            // Update the inventory record to match the new part number
            const updateInventoryQuery = `
                UPDATE inventory
                SET part_number = $1
                WHERE part_number = $2;
            `;
            await client.query(updateInventoryQuery, [partNumber, originalPartNumber]);

            const deleteOldProductQuery = `DELETE FROM products WHERE part_number = $1;`;
            await client.query(deleteOldProductQuery, [originalPartNumber]);
        }

        if (oldType !== type) {
            // Check if the old type still exists in other products
            const checkForOldType = `SELECT * FROM products WHERE type = $1;`;
            const resultOldType = await client.query(checkForOldType, [oldType]);
            if (resultOldType.rows.length === 0) {
                // If old type no longer exists, remove it from category_mappings
                const deleteFromMappings = `DELETE FROM category_mappings WHERE category = $1;`;
                await client.query(deleteFromMappings, [oldType]);
            }

            // Check if the new type exists in category_mappings
            const checkForNewType = `SELECT * FROM category_mappings WHERE category = $1;`;
            const resultNewType = await client.query(checkForNewType, [type]);
            if (resultNewType.rows.length === 0) {
                // If new type does not exist, prepare to add it to category_mappings
                // Split the 'type' into individual words for keywords
                const keywords = type.split(/\s+/); // Splits the type into words by whitespace

                // Insert the type as category and the words as keywords
                const insertIntoMappings = `
                    INSERT INTO category_mappings (category, keywords, catcode) 
                    VALUES ($1, $2, $3);
                `;
                await client.query(insertIntoMappings, [type, keywords, catCode]);
            }
        }

        if (!partNumber || !price || !supplierPartNumber || !materialType || !description || !type || !quantityOfItem) {
            return res.status(400).json({ error: 'Validation error', message: 'Required fields not entered.' });
        }

        // After updating the product and before sending the response
        await logInventoryAction('Update Product', req.username, 'inventory', { 
            message: 'Product Information Updated', 
            details: { ...req.body } 
        });

        // Commit transaction
        await client.query('COMMIT');

        res.json({ message: 'Product and inventory updated successfully.' });
    } catch (err) {
        console.error(err.message);
        let userMessage = 'Failed to update product and inventory';
        if (err.code === '23505') {
            userMessage = 'Duplicate entry for part number';
        }
        res.status(500).json({ error: 'Database error', message: userMessage, details: err.detail });
    } finally {
        client.release();
    }
});

router.get('/with-inventory', authorization, async (req, res) => {
    try {
        // Perform a SQL JOIN to fetch products with their inventory quantity
        const productsWithInventory = await pool.query(`
            SELECT p.*, i.quantity_in_stock
            FROM products p
            INNER JOIN inventory i ON p.part_number = i.part_number;
        `);

        res.json({
            message: 'Products with inventory fetched successfully',
            products: productsWithInventory.rows,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch products with inventory' });
    }
});

router.get('/search', async (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        return res.status(400).json({ error: "Search term is required" });
    }

    try {
        const query = `
            SELECT part_number, radius_size, description
            FROM products
            WHERE part_number ILIKE $1 OR description ILIKE $1
            ORDER BY part_number;
        `;
        const results = await pool.query(query, [`%${searchTerm}%`]);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error searching for products' });
    }
});


// Add this new route to your existing routes in products.js

router.get('/category/:category', authorization, async (req, res) => {
    try {
        const { category } = req.params;
        // Replace 'type' with your actual column name for the category in the 'products' table.
        const products = await pool.query(`
            SELECT * FROM products WHERE type = $1;
        `, [category]);
        
        if(products.rowCount === 0) {
            await pool.query('DELETE FROM category_mappings WHERE category = $1 RETURNING *', [category]);
        }

        res.json({
            message: `Products fetched successfully for category: ${category}`,
            products: products.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
});

module.exports = router;
module.exports.logInventoryAction = logInventoryAction; // Export the function