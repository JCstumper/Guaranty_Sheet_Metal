const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust the path to db.js as necessary

// Get all invoices
router.get('/', async (req, res) => {
    try {
        const allInvoices = await pool.query(
            'SELECT invoice_id, supplier_name, TO_CHAR(total_cost, \'FM$999,999,999.00\') AS total_cost, TO_CHAR(invoice_date, \'MM/DD/YYYY\') AS invoice_date, status FROM invoices ORDER BY invoice_id DESC'
        );
        res.json(allInvoices.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});


// Create a new invoice
router.post('/', async (req, res) => {
    try {
        const { supplier_name, total_cost, invoice_date, status } = req.body;
        // Assuming that total_cost is being sent as a number that can be inserted directly into a DECIMAL field
        const newInvoice = await pool.query(
            'INSERT INTO invoices (supplier_name, total_cost, invoice_date, status) VALUES ($1, $2, $3, $4) RETURNING invoice_id, supplier_name, TO_CHAR(total_cost, \'FM$999,999,999.00\') AS total_cost, TO_CHAR(invoice_date, \'MM/DD/YYYY\') AS invoice_date, status',
            [supplier_name, total_cost, invoice_date, status]
        );
        res.status(201).json(newInvoice.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// Get low inventory items
router.get('/inventory/low', async (req, res) => {
    try {
        const lowInventoryItems = await pool.query(
            `SELECT p.part_number, p.material_type, p.description, i.quantity_in_stock
            FROM products p
            JOIN inventory i ON p.part_number = i.part_number
            WHERE i.quantity_in_stock BETWEEN 1 AND 15
            ORDER BY i.quantity_in_stock ASC`
        );
        res.json(lowInventoryItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// Get out-of-stock items
router.get('/inventory/out-of-stock', async (req, res) => {
    try {
        const outOfStockItems = await pool.query(
            `SELECT p.part_number, p.material_type, p.description, i.quantity_in_stock
            FROM products p
            JOIN inventory i ON p.part_number = i.part_number
            WHERE i.quantity_in_stock = 0
            ORDER BY p.part_number ASC`
        );
        res.json(outOfStockItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});


// Endpoint to update the status of an order (invoice)
router.patch('/:invoiceId/status', async (req, res) => {
    const { invoiceId } = req.params;
    const { status, items } = req.body; // Include items in the request body when status is "Generated"

    try {
        // Fetch the current status of the order
        const orderResult = await pool.query('SELECT status FROM invoices WHERE invoice_id = $1', [invoiceId]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Order not found." });
        }

        const currentStatus = orderResult.rows[0].status;

        // Prevent modifications if the order is already in "Generated" or "Received" status
        if (currentStatus !== 'Building' && status !== currentStatus) {
            return res.status(400).json({ message: "Order status cannot be modified from its current state." });
        }

        // Update the order status
        await pool.query('UPDATE invoices SET status = $1 WHERE invoice_id = $2', [status, invoiceId]);

        // If the status is being updated to "Generated", insert the items into invoice_items
        if (status === 'Generated' && items && items.length > 0) {
            // Start a transaction to ensure data integrity
            await pool.query('BEGIN');

            try {
                for (const item of items) {
                    await pool.query(`
                        INSERT INTO invoice_items (invoice_id, part_number, quantity)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (invoice_id, part_number) DO UPDATE
                        SET quantity = invoice_items.quantity + EXCLUDED.quantity`,
                        [invoiceId, item.part_number, item.quantity]
                    );
                }

                // Commit the transaction if all insertions are successful
                await pool.query('COMMIT');
            } catch (error) {
                // Rollback the transaction in case of any error
                await pool.query('ROLLBACK');
                console.error('Transaction failed: ', error);
                throw error;
            }
        }

        res.json({ message: "Order status updated successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});



module.exports = router;

