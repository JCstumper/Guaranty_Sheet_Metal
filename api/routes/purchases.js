const express = require('express');
const router = express.Router();
const pool = require('../db'); // Adjust the path to db.js as necessary
const ExcelJS = require('exceljs');

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


router.post('/', async (req, res) => {
    try {
        let { supplier_name, total_cost, invoice_date, status } = req.body;
        // Convert empty string to null for total_cost
        total_cost = total_cost === '' ? null : total_cost;

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
            'SELECT p.part_number, p.material_type, p.description, i.quantity_in_stock FROM products p JOIN inventory i ON p.part_number = i.part_number WHERE i.quantity_in_stock BETWEEN 1 AND 30 ORDER BY i.quantity_in_stock ASC'
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
            WHERE i.quantity_in_stock BETWEEN 1 AND 30
            ON CONFLICT (invoice_id, part_number) DO UPDATE
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
             ON CONFLICT (invoice_id, part_number) DO UPDATE
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
            SELECT li.invoice_id, li.part_number, li.quantity, p.material_type, p.description
            FROM low_inventory li
            JOIN products p ON li.part_number = p.part_number
            WHERE li.invoice_id = $1;
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
            SELECT oos.invoice_id, oos.part_number, oos.quantity, p.material_type, p.description
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

// Fetch new order items for a specific invoice
router.get('/:invoiceId/new-order-items', async (req, res) => {
    const { invoiceId } = req.params;

    try {
        // Adjust the query to include the amount_to_order column
        const newOrderItems = await pool.query(`
            SELECT no.invoice_id, no.part_number, no.quantity, no.amount_to_order, p.material_type, p.description
            FROM new_orders no
            JOIN products p ON no.part_number = p.part_number
            WHERE no.invoice_id = $1;
        `, [invoiceId]);


        // Return the rows of items in the response
        res.json(newOrderItems.rows);
    } catch (err) {
        // Log the error to the console for debugging
        console.error('Error fetching new order items:', err.message);
        // Respond with a 500 server error status code and message
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

router.patch('/:invoiceId/status', async (req, res) => {
    const { invoiceId } = req.params;
    const { status, items } = req.body; // Ensure items include partNumber and amountToOrder for newOrder items

    try {
        // Retrieve the current status and total cost of the order to calculate markup
        const orderResult = await pool.query('SELECT status, total_cost FROM invoices WHERE invoice_id = $1', [invoiceId]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Order not found." });
        }

        const currentStatus = orderResult.rows[0].status;
        const totalCost = parseFloat(orderResult.rows[0].total_cost); // Ensure totalCost is a number

        await pool.query('BEGIN');

        console.log(`Updating status for invoice ${invoiceId} to ${status}`);

        // Update the order status
        await pool.query('UPDATE invoices SET status = $1 WHERE invoice_id = $2', [status, invoiceId]);

        if (status === 'Received' && currentStatus !== 'Received') {
            console.log(`Received items to update inventory: `, items);
            // Calculate the markup price per item based on the total cost and total number of items
            const totalItems = items.reduce((acc, item) => acc + parseInt(item.amountToOrder, 10), 0);
            const markupPerItem = totalCost / totalItems;

            for (const item of items) {
                // Update inventory for each item
                console.log(`Updating inventory for part ${item.partNumber} with amount ${item.amountToOrder}`);
                await pool.query(`
                    UPDATE inventory
                    SET quantity_in_stock = quantity_in_stock + $1
                    WHERE part_number = $2
                `, [item.amountToOrder, item.partNumber]);

                // Update mark_up_price for each item based on the calculated markupPerItem
                console.log(`Updating mark_up_price for part ${item.partNumber} with markup ${markupPerItem.toFixed(2)}`);
                await pool.query(`
                    UPDATE products
                    SET mark_up_price = $1::money
                    WHERE part_number = $2
                `, [markupPerItem.toFixed(2), item.partNumber]); // Ensure markupPerItem is converted to a string and formatted as needed
            }
        }

        if (status === 'Generated' && Array.isArray(items)) {
            for (const item of items) {
                await pool.query(`
                    UPDATE new_orders 
                    SET amount_to_order = $1 
                    WHERE invoice_id = $2 AND part_number = $3
                `, [item.amountToOrder, invoiceId, item.partNumber]);
            }
        }

        await pool.query('COMMIT');

        res.json({ message: "Order status, inventory, and product mark-up prices updated successfully." });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json('Server error');
    }
});




// Add an item to the new order
router.post('/add-to-new-order/:invoiceId', async (req, res) => {
    const { invoiceId } = req.params;
    const { partNumber, quantity, source, amount_to_order } = req.body; // source is 'lowInventory' or 'outOfStock'

    // First, check the status of the order
    const order = await pool.query('SELECT status FROM invoices WHERE invoice_id = $1', [invoiceId]);
    if (order.rows[0].status === "Generated" || order.rows[0].status === "Received") {
        return res.status(403).json({ message: "Modifications are not allowed for generated or received orders." });
    }

    try {
        // Start transaction
        await pool.query('BEGIN');

        // Insert item into new_order
        await pool.query(`
            INSERT INTO new_orders (invoice_id, part_number, quantity, amount_to_order)
             VALUES ($1, $2, $3, $4)
        `, [invoiceId, partNumber, quantity, amount_to_order]);

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

// Remove an item from the new order and insert it back into either low_inventory or out_of_stock based on quantity
router.post('/remove-from-new-order/:invoiceId', async (req, res) => {
    const { invoiceId } = req.params;
    const { partNumber, quantity } = req.body;

    // First, check the status of the order
    const order = await pool.query('SELECT status FROM invoices WHERE invoice_id = $1', [invoiceId]);
    if (order.rows[0].status === "Generated" || order.rows[0].status === "Received") {
        return res.status(403).json({ message: "Modifications are not allowed for generated or received orders." });
    }

    // Start transaction
    await pool.query('BEGIN');

    try {
        // Remove item from new_orders
        await pool.query(
            `DELETE FROM new_orders WHERE part_number = $1 AND invoice_id = $2`,
            [partNumber, invoiceId]
        );

        // Determine the target table based on quantity and perform insert or update operation
        const targetTable = quantity > 0 ? 'low_inventory' : 'out_of_stock';
        await pool.query(
            `INSERT INTO ${targetTable} (invoice_id, part_number, quantity)
             VALUES ($1, $2, $3)
             ON CONFLICT (invoice_id, part_number)
             DO UPDATE SET quantity = EXCLUDED.quantity;`,
            [invoiceId, partNumber, quantity]
        );

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

// Endpoint to update the 'amount to order' for each item in an order
router.post('/:invoiceId/update-amounts', async (req, res) => {
    const { invoiceId } = req.params;
    const { items } = req.body; // Expecting an array of { partNumber, amountToOrder }

    try {
        await pool.query('BEGIN'); // Start transaction

        // Loop through each item and update its 'amount to order'
        for (const { partNumber, amountToOrder } of items) {
            await pool.query(`
                UPDATE new_orders
                SET amount_to_order = $1
                WHERE invoice_id = $2 AND part_number = $3
            `, [amountToOrder, invoiceId, partNumber]);
        }

        await pool.query('COMMIT'); // Commit transaction
        res.json({ message: "Amounts to order updated successfully." });
    } catch (error) {
        await pool.query('ROLLBACK'); // Roll back transaction on error
        console.error('Failed to update amounts to order:', error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/:invoiceId/generate-xlsx', async (req, res) => {
    const { invoiceId } = req.params;

    try {
        // Fetch new order items from the database
        const { rows: newOrderItems } = await pool.query(`
      SELECT p.supplier_part_number, p.description, no.amount_to_order
      FROM new_orders no
      JOIN products p ON no.part_number = p.part_number
      WHERE no.invoice_id = $1;
    `, [invoiceId]);

        // Create a new workbook and add a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('New Order');

        // Add the headers
        worksheet.columns = [
            { header: 'Item', key: 'supplier_part_number', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Quantity', key: 'amount_to_order', width: 20 }
        ];

        // Add rows using the data from newOrderItems
        worksheet.addRows(newOrderItems);

        // Write to a buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Set MIME type to Excel and send the response
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="New_Order.xlsx"');
        res.send(buffer);
    } catch (error) {
        console.error('Error generating XLSX:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Inside your Express router...

// DELETE endpoint to delete an order by its invoice_id
router.delete('/:invoiceId', async (req, res) => {
    const { invoiceId } = req.params;
    try {
        await pool.query('BEGIN');

        // Delete related items from new_orders, low_inventory, and out_of_stock
        await pool.query('DELETE FROM new_orders WHERE invoice_id = $1', [invoiceId]);
        await pool.query('DELETE FROM low_inventory WHERE invoice_id = $1', [invoiceId]);
        await pool.query('DELETE FROM out_of_stock WHERE invoice_id = $1', [invoiceId]);

        // Finally, delete the order from the invoices table
        await pool.query('DELETE FROM invoices WHERE invoice_id = $1', [invoiceId]);

        await pool.query('COMMIT');
        res.json({ message: 'Order successfully deleted.' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Failed to delete order:', error);
        res.status(500).json('Server error');
    }
});

// Endpoint to update the total cost of an order
router.patch('/:invoiceId/edit-total-cost', async (req, res) => {
    const { invoiceId } = req.params;
    const { total_cost } = req.body;

    try {
        await pool.query('UPDATE invoices SET total_cost = $1 WHERE invoice_id = $2', [total_cost, invoiceId]);
        res.json({ message: "Total cost updated successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});


module.exports = router;
