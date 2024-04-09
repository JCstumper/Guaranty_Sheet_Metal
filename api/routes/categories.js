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
        // First, check if the category or catcode already exists
        const existingMapping = await pool.query(
            'SELECT * FROM category_mappings WHERE category = $1 OR catcode = $2',
            [category, catcode]
        );

        // If the query returns any rows, the category or catcode already exists
        if (existingMapping.rows.length > 0) {
            return res.status(400).send('Category or Catcode already exists.');
        }

        // If no existing category or catcode, insert the new mapping
        const newMapping = await pool.query(
            'INSERT INTO category_mappings (keywords, category, catcode) VALUES ($1, $2, $3) RETURNING *;',
            [keywords, category, catcode]
        );

        // Return the newly inserted mapping
        res.json(newMapping.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/getCatCode/:category', async (req, res) => {
    const { category } = req.params; // Get the category from the query string
    try {
        const categoryMapping = await pool.query(
            'SELECT catcode FROM category_mappings WHERE category = $1;',
            [category]
        );
        res.json(categoryMapping.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
