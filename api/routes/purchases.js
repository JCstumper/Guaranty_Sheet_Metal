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


//Get all low inventory
router.get('/low-inventory', async (req, res) => {
    try {
        const lowInventoryItems = await pool.query(
            'SELECT p.part_number, p.material_type, p.description, i.quantity_in_stock FROM products p JOIN inventory i ON p.part_number = i.part_number WHERE i.quantity_in_stock BETWEEN 1 AND 15 ORDER BY i.quantity_in_stock ASC'
        );
        res.json(lowInventoryItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});


// Get all Out of stock inventory
router.get('/out-of-stock', async (req, res) => {
    try {
        const outOfStockItems = await pool.query(
            'SELECT p.part_number, p.material_type, p.description, i.quantity_in_stock FROM products p JOIN inventory i ON p.part_number = i.part_number WHERE i.quantity_in_stock = 0 ORDER BY p.part_number ASC'
        );
        res.json(outOfStockItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// API endpoint to update low inventory items for a specific invoice
router.post('/:invoiceId/update-low-inventory', async (req, res) => {
    const { invoiceId } = req.params; // Extract invoiceId from request parameters
    try {
        await pool.query(
            `INSERT INTO low_inventory (invoice_id, part_number, quantity)
            SELECT $1, i.part_number, i.quantity_in_stock
            FROM inventory i
            INNER JOIN products p ON i.part_number = p.part_number
            WHERE i.quantity_in_stock BETWEEN 1 AND 15
            ON CONFLICT (part_number) DO UPDATE
            SET quantity = EXCLUDED.quantity`, [invoiceId]
        );
        res.json({ message: "Low inventory items updated successfully for invoice " + invoiceId });
    } catch (err) {
        console.error('Error executing query:', err.stack);
        return res.status(500).json('Server error');
    }
});

// API endpoint to update out of stock items for a specific invoice
router.post('/:invoiceId/update-out-of-stock', async (req, res) => {
    const { invoiceId } = req.params; // Extract invoiceId from request parameters
    try {
        await pool.query(
            `INSERT INTO out_of_stock (invoice_id, part_number, quantity)
            SELECT $1, i.part_number, i.quantity_in_stock
            FROM inventory i
            INNER JOIN products p ON i.part_number = p.part_number
            WHERE i.quantity_in_stock = 0
            ON CONFLICT (part_number) DO UPDATE
            SET quantity = EXCLUDED.quantity`, [invoiceId]
        );
        res.json({ message: "Out of stock items updated successfully for invoice " + invoiceId });
    } catch (err) {
        console.error('Error executing query:', err.stack);
        return res.status(500).json('Server error');
    }
});

// Fetch low inventory items for a specific invoice
router.get('/:invoiceId/low-inventory', async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const lowInventoryItems = await pool.query(`
            SELECT li.invoice_item_id, li.invoice_id, li.part_number, li.quantity, p.material_type, p.description
            FROM low_inventory li
            JOIN products p ON li.part_number = p.part_number
            WHERE li.invoice_id = $1
        `, [invoiceId]);

        res.json(lowInventoryItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// Fetch out-of-stock items for a specific invoice
router.get('/:invoiceId/out-of-stock', async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const outOfStockItems = await pool.query(`
            SELECT oos.invoice_item_id, oos.invoice_id, oos.part_number, oos.quantity, p.material_type, p.description
            FROM out_of_stock oos
            JOIN products p ON oos.part_number = p.part_number
            WHERE oos.invoice_id = $1
        `, [invoiceId]);

        res.json(outOfStockItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});


// API endpoint to get the details of a specific order
router.get('/:invoiceId', async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const orderDetails = await pool.query(
            'SELECT * FROM invoices WHERE invoice_id = $1',
            [invoiceId]
        );

        if (orderDetails.rows.length > 0) {
            res.json(orderDetails.rows[0]);
        } else {
            res.status(404).json({ message: "Order not found." });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// Endpoint to update the status of an order (invoice)
router.patch('/:invoiceId/status', async (req, res) => {
    const { invoiceId } = req.params;
    const { status } = req.body; // Expected to be one of "Building", "Generated", "Received"

    try {
        // Fetch the current status of the order
        const orderResult = await pool.query('SELECT status FROM invoices WHERE invoice_id = $1', [invoiceId]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Order not found." });
        }

        const currentStatus = orderResult.rows[0].status;

        // Prevent modifications if the order is in "Generated" status, except to change it to "Received"
        if (currentStatus === 'Generated' && status !== 'Received') {
            return res.status(400).json({ message: "Order is generated and cannot be modified except to be received." });
        }

        // Update the order status
        await pool.query('UPDATE invoices SET status = $1 WHERE invoice_id = $2', [status, invoiceId]);

        // If the status is updated to "Received", add logic here to update inventory based on the order's items
        // Assuming 'status' is 'Received'
        if (status === 'Received') {
            // Start a transaction to ensure data integrity
            await pool.query('BEGIN');

            try {
                // Fetch the items associated with the invoice/order
                const itemsResult = await pool.query(`
            SELECT part_number, quantity 
            FROM invoice_items 
            WHERE invoice_id = $1`,
                    [invoiceId]
                );

                // Update the inventory for each item associated with the invoice/order
                for (const item of itemsResult.rows) {
                    await pool.query(`
                UPDATE inventory 
                SET quantity_in_stock = quantity_in_stock + $1 
                WHERE part_number = $2`,
                        [item.quantity, item.part_number]
                    );
                }

                // Commit the transaction if all inventory updates are successful
                await pool.query('COMMIT');
            } catch (error) {
                // Rollback the transaction in case of any error
                await pool.query('ROLLBACK');
                // Log the error or notify accordingly
                console.error('Transaction failed: ', error);
                // Optionally rethrow the error or handle it as per your error handling policy
                throw error;
            }
        }


        res.json({ message: "Order status updated successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

// Add an item to the new order
router.post('/add-to-new-order/:invoiceId', async (req, res) => {
    const { invoiceId } = req.params;
    const { partNumber, quantity, source } = req.body; // source is 'lowInventory' or 'outOfStock'

    try {
        // Start transaction
        await pool.query('BEGIN');

        // Insert item into new_order
        await pool.query(`
            INSERT INTO new_orders (invoice_id, part_number, quantity)
            VALUES ($1, $2, $3)
        `, [invoiceId, partNumber, quantity]);

        // Remove item from its original table
        if (source === 'lowInventory') {
            await pool.query(`
                DELETE FROM low_inventory WHERE part_number = $1
            `, [partNumber]);
        } else if (source === 'outOfStock') {
            await pool.query(`
                DELETE FROM out_of_stock WHERE part_number = $1
            `, [partNumber]);
        }

        // Commit transaction
        await pool.query('COMMIT');

        res.json({ message: "Item added to new order successfully." });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error executing query:', err.stack);
        res.status(500).json('Server error');
    }
});

// Remove an item from the new order
router.post('/remove-from-new-order/:invoiceId', async (req, res) => {
    const { invoiceId } = req.params;
    const { partNumber, quantity, source } = req.body;

    // Begin transaction
    await pool.query('BEGIN');

    try {
        // Remove item from new_orders
        await pool.query(
            `DELETE FROM new_orders WHERE part_number = $1`,
            [partNumber]
        );

        // Insert item back into its original table based on 'source'
        if (source === 'lowInventory') {
            await pool.query(
                `INSERT INTO low_inventory (invoice_id, part_number, quantity)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (part_number) DO
                 UPDATE SET quantity = EXCLUDED.quantity;`,
                [invoiceId, partNumber, quantity]
            );
        } else if (source === 'outOfStock') {
            await pool.query(
                `INSERT INTO out_of_stock (invoice_id, part_number, quantity)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (part_number) DO
                 UPDATE SET quantity = EXCLUDED.quantity;`,
                [invoiceId, partNumber, quantity]
            );
        }

        // Commit the transaction
        await pool.query('COMMIT');
        res.json({ message: "Item moved back successfully." });
    } catch (error) {
        // Roll back the transaction in case of any error
        await pool.query('ROLLBACK');
        console.error('Error during transaction', error);
        res.status(500).json({ message: 'Server error during transaction' });
    }
});



module.exports = router;
