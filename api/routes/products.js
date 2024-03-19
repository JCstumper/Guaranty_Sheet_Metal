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
        const { partNumber, size, metalType, description, productType, length, pieces, price, priceWithTransport, unit} = req.body;
        const newProduct = await pool.query(`
        INSERT INTO products (
            part_number, 
            size, 
            material_type, 
            description, 
            type,
            length, 
            pieces,
            price, 
            w_trans,
            unit
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;       
        `, [partNumber, size, metalType, description, productType, length, pieces, price, priceWithTransport, unit]);

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
