// routes/inventory.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // make sure the path to db.js is correct

router.get('/', async (req, res) => {
    try {
        const inventory = await pool.query(`
        SELECT * FROM inventory
        `);
        res.json({inventory});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update quantity in stock for a specific inventory item based on part_number
router.patch('/:part_number/quantity', async (req, res) => {
    const { part_number } = req.params; // Get the part_number from URL params
    const { quantity_in_stock } = req.body; // New quantity from the request body

    try {
        const updateQuery = `
            UPDATE inventory
            SET quantity_in_stock = $1
            WHERE part_number = $2
            RETURNING *;`; // Returns the updated inventory item

        const updatedInventory = await pool.query(updateQuery, [quantity_in_stock, part_number]);

        if (updatedInventory.rows.length === 0) {
            // No inventory item was found with the given part_number, or no update was made
            return res.status(404).json({ message: "Inventory item not found for the given part number." });
        }

        // Respond with the updated inventory item
        res.json(updatedInventory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;
