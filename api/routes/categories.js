const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust path as needed

router.get('/', async (req, res) => {
    try {
        const categories = await pool.query('SELECT * FROM category_mappings');
        res.json(categories.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new category mapping
router.post('/', async (req, res) => {
    const { keywords, category, catcode } = req.body;

    try {
        const existingMapping = await pool.query(
            'SELECT * FROM category_mappings WHERE category = $1 OR catcode = $2',
            [category, catcode]
        );

        if (existingMapping.rows.length > 0) {
            return res.status(400).send('Category or Catcode already exists.');
        }

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


router.get('/getCatCode/:category', async (req, res) => {
    const { category } = req.params;
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
