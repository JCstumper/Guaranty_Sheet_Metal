// routes/products.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // make sure the path to db.js is correct

router.get('/', async (req, res) => {
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

router.post('/', async (req, res) => {
    try {
        // Extracting fields from req.body based on the structure provided earlier
        const {
            partNumber,      // Maps to 'part_number'
            radiusSize,      // Originally 'size', now correctly mapped to 'radius_size'
            materialType,    // Maps to 'material_type'
            color,           // New addition, maps to 'color'
            description,     // Maps to 'description'
            type,            // Maps to 'type'
            quantityOfItem,  // Maps to 'quantity_of_item', adjusted for decimal type
            unit,            // Maps to 'unit'
            price,           // Maps to 'price', note: handling MONEY type correctly is important
            markUpPrice      // Maps to 'mark_up_price', same note on MONEY type
        } = req.body;

        // Ensure the SQL query matches your database schema
        const newProduct = await pool.query(`
        INSERT INTO products (
            part_number, 
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
        `, [partNumber, radiusSize, materialType, color, description, type, quantityOfItem, unit, price, markUpPrice]);

        await pool.query(`
            INSERT INTO inventory (part_number, quantity_in_stock)
            VALUES ($1, $2) RETURNING *;
        `, [partNumber, 0]); // Use the partNumber from req.body and a default quantity of 0

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

router.delete('/:partNumber', async (req, res) => {
    try {
        const { partNumber } = req.params;

        // First, delete any related inventory records for the product to avoid foreign key constraints.
        // This assumes that `part_number` is used as a reference in your `inventory` table.
        const inventoryDeletionResponse = await pool.query(`
            DELETE FROM inventory
            WHERE part_number = $1;
        `, [partNumber]);

        console.log(`Deleted ${inventoryDeletionResponse.rowCount} inventory record(s) for part number: ${partNumber}`);

        // Then, delete the product from the products table.
        const productDeletionResponse = await pool.query(`
            DELETE FROM products
            WHERE part_number = $1
            RETURNING *;
        `, [partNumber]);

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

// PUT route to update a product and its part number
router.put('/:originalPartNumber', async (req, res) => {
    try {
        const { originalPartNumber } = req.params;
        const {
            newPartNumber,   // New part number to update
            radiusSize,      // Maps to 'radius_size'
            materialType,    // Maps to 'material_type'
            color,           // Maps to 'color'
            description,     // Maps to 'description'
            type,            // Maps to 'type'
            quantityOfItem,  // Maps to 'quantity_of_item'
            unit,            // Maps to 'unit'
            price,           // Maps to 'price'
            markUpPrice      // Maps to 'mark_up_price'
        } = req.body;

        // Begin transaction
        await pool.query('BEGIN');

        // Update the product with the matching original part number
        const updateProductQuery = `
            UPDATE products
            SET 
                part_number = $1,
                radius_size = $2, 
                material_type = $3, 
                color = $4, 
                description = $5, 
                type = $6, 
                quantity_of_item = $7, 
                unit = $8, 
                price = $9, 
                mark_up_price = $10
            WHERE part_number = $11
            RETURNING *;
        `;

        const updatedProduct = await pool.query(updateProductQuery, [newPartNumber, radiusSize, materialType, color, description, type, quantityOfItem, unit, price, markUpPrice, originalPartNumber]);

        // If no rows were updated, the original product was not found
        if (updatedProduct.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update the inventory record to match the new part number
        const updateInventoryQuery = `
            UPDATE inventory
            SET part_number = $1
            WHERE part_number = $2;
        `;

        await pool.query(updateInventoryQuery, [newPartNumber, originalPartNumber]);

        // Commit transaction
        await pool.query('COMMIT');

        res.json({
            message: 'Product and inventory updated successfully',
            product: updatedProduct.rows[0],
        });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Failed to update product and inventory' });
    }
});

router.get('/with-inventory', async (req, res) => {
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


module.exports = router;
