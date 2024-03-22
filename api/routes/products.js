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
