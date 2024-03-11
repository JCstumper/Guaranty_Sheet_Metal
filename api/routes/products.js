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
        const { partNumber, size, materialType, description, productType, length, price, priceWithTransport, unit, categoryName} = req.body;

        const newProduct = await pool.query(`
        INSERT INTO products (part_number, size, material_type, description, product_type, length, price, price_with_transport, unit, category_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
        `, [partNumber, size, materialType, description, productType, length, price, priceWithTransport, unit, categoryName]);

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add product' });
    }
});


module.exports = router;
