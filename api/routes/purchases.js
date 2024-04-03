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

module.exports = router;
