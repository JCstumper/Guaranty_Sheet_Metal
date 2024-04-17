// routes/inventory.js
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
router.patch('/:part_number/quantity', authorization, async (req, res) => {
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

        await logInventoryAction('Update Quantity', req.username, 'inventory', { 
            message: 'Product Quantity In Stock Updated', 
            details: { ...req.body } 
        });

        // Respond with the updated inventory item
        res.json(updatedInventory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Add this route to get the inventory for a specific part number
router.get('/:part_number', authorization, async (req, res) => {
    const { part_number } = req.params;
    try {
        const inventory = await pool.query('SELECT * FROM inventory WHERE part_number = $1', [part_number]);
        if (inventory.rows.length === 0) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }
        res.json(inventory.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;