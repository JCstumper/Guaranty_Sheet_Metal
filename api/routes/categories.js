const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust path as needed

// Fetch categories
router.get('/', async (req, res) => {
    try {
        const categories = await pool.query('SELECT * FROM category_mappings'); // Adjust SQL as per your schema
        res.json(categories.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new category mapping
router.post('/', async (req, res) => {
    const { keywords, category, catcode } = req.body; // Adjust based on your database schema
    try {
        // SQL to insert a new category mapping, adjust table name/columns as needed
        const newMapping = await pool.query(
            'INSERT INTO category_mappings (keywords, category, catcode) VALUES ($1, $2, $3) RETURNING *;',
            [keywords, category, catcode]
        );
        res.json(newMapping.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
