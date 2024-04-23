const express = require('express');
const router = express.Router();
const pool = require('../db'); 
const ExcelJS = require('exceljs');
const authorization = require("../middleware/authorization");

async function logJobsAction(actionType, userId, logType, changeDetails) {
    const logQuery = `
        INSERT INTO log (action_type, user_id, log_type, change_details) 
        VALUES ($1, $2, $3, $4);
    `;
    try {
        await pool.query(logQuery, [actionType, userId, logType, JSON.stringify(changeDetails)]);
    } catch (err) {
        console.error('Failed to log purchase action:', err.message);
    }
}

router.get('/', authorization, async (req, res) => {
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

router.post('/', authorization, async (req, res) => {
    try {
        let { supplier_name, total_cost, invoice_date, status } = req.body;
        
        total_cost = total_cost === '' ? null : total_cost;

        const newInvoice = await pool.query(
            'INSERT INTO invoices (supplier_name, total_cost, invoice_date, status) VALUES ($1, $2, $3, $4) RETURNING invoice_id, supplier_name, TO_CHAR(total_cost, \'FM$999,999,999.00\') AS total_cost, TO_CHAR(invoice_date, \'MM/DD/YYYY\') AS invoice_date, status',
            [supplier_name, total_cost, invoice_date, status]
        );

        // Log the action
        await logJobsAction('Add', req.username, 'Invoice', {
            message: 'Added invoice',
            details: { ...req.body } 
        });

        res.status(201).json(newInvoice.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});


router.get('/low-inventory', authorization, async (req, res) => {
    try {
        const lowInventoryItems = await pool.query(
            `SELECT p.part_number, p.material_type, p.description, i.quantity_in_stock
             FROM products p
             JOIN inventory i ON p.part_number = i.part_number
             WHERE i.quantity_in_stock BETWEEN 1 AND 30
             AND NOT EXISTS (
                 SELECT 1 FROM inventory WHERE quantity_in_stock = 0 AND part_number = i.part_number
             )
             ORDER BY i.quantity_in_stock ASC`
        );
        res.json(lowInventoryItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

router.get('/out-of-stock', authorization, async (req, res) => {
    try {
        const outOfStockItems = await pool.query(
            `SELECT p.part_number, p.material_type, p.description, i.quantity_in_stock
             FROM products p
             JOIN inventory i ON p.part_number = i.part_number
             WHERE i.quantity_in_stock = 0
             AND NOT EXISTS (
                 SELECT 1 FROM inventory WHERE quantity_in_stock BETWEEN 1 AND 30 AND part_number = i.part_number
             )
             ORDER BY p.part_number ASC`
        );
        res.json(outOfStockItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});


router.post('/:invoiceId/update-low-inventory', authorization, async (req, res) => {
    const { invoiceId } = req.params;
    try {
        const result = await pool.query(
            `INSERT INTO low_inventory (invoice_id, part_number, quantity)
            SELECT $1, i.part_number, i.quantity_in_stock
            FROM inventory i
            INNER JOIN products p ON i.part_number = p.part_number
            WHERE i.quantity_in_stock BETWEEN 1 AND 30
            ON CONFLICT (invoice_id, part_number) DO UPDATE
            SET quantity = EXCLUDED.quantity`, [invoiceId]
        );

        // Assuming result contains the number of rows affected
        const updatedRows = result.rowCount;

        await logJobsAction('Update', req.username, 'Low Inventory', {
            message: `Updated ${updatedRows} low inventory items for invoice ${invoiceId}`,
            // Only log meaningful details or aggregate information
        });
        res.json({ message: `Low inventory items updated successfully for invoice ${invoiceId}` });
    } catch (err) {
        console.error('Error executing query:', err.stack);
        return res.status(500).json('Server error');
    }
});


router.post('/:invoiceId/update-out-of-stock', authorization, async (req, res) => {
    const { invoiceId } = req.params;
    try {
        const result = await pool.query(
            `INSERT INTO out_of_stock (invoice_id, part_number, quantity)
            SELECT $1, i.part_number, i.quantity_in_stock
            FROM inventory i
            INNER JOIN products p ON i.part_number = p.part_number
            WHERE i.quantity_in_stock = 0
            ON CONFLICT (invoice_id, part_number) DO UPDATE
            SET quantity = EXCLUDED.quantity`, [invoiceId]
        );

        // Assuming result contains the number of rows affected
        const updatedRows = result.rowCount;

        await logJobsAction('Update', req.username, 'Out-of-Stock Inventory', {
            message: `Updated ${updatedRows} out-of-stock items for invoice ${invoiceId}`,
            // Only log meaningful details or aggregate information
        });

        res.json({ message: `Out of stock items updated successfully for invoice ${invoiceId}` });
    } catch (err) {
        console.error('Error executing query:', err.stack);
        return res.status(500).json('Server error');
    }
});



router.get('/:invoiceId/low-inventory', authorization, async (req, res) => {
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


router.get('/:invoiceId/out-of-stock', authorization, async (req, res) => {
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


router.get('/:invoiceId/new-order-items', authorization, async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const newOrderItems = await pool.query(`
            SELECT no.invoice_id, no.part_number, no.quantity, no.amount_to_order, p.material_type, p.description
            FROM new_orders no
            JOIN products p ON no.part_number = p.part_number
            WHERE no.invoice_id = $1 AND no.part_number IS NOT NULL AND no.amount_to_order > 0;
        `, [invoiceId]);

        res.json(newOrderItems.rows.filter(item => item.part_number && item.amount_to_order > 0));
    } catch (err) {
        console.error('Error fetching new order items:', err.message);
        res.status(500).json('Server error');
    }
});




router.get('/:invoiceId', authorization, async (req, res) => {
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

router.patch('/:invoiceId/status', authorization, async (req, res) => {
    const { invoiceId } = req.params;
    const { status, items, total_cost } = req.body; // Ensure total_cost is passed in the request

    try {
        const orderResult = await pool.query('SELECT status, total_cost FROM invoices WHERE invoice_id = $1', [invoiceId]);
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: "Order not found." });
        }

        const currentStatus = orderResult.rows[0].status;

        await pool.query('BEGIN');

        await pool.query('UPDATE invoices SET status = $1, total_cost = $2 WHERE invoice_id = $3', [status, total_cost, invoiceId]);

        if (status === 'Received' && currentStatus !== 'Received') {

            let totalOrderedItems = items.reduce((sum, item) => sum + parseInt(item.amountToOrder, 10), 0);
            let costPerItem = parseFloat(total_cost) / totalOrderedItems; // Calculate the shipping cost per item
            for (const item of items) {
                await pool.query(`
                    UPDATE inventory
                    SET quantity_in_stock = quantity_in_stock + $1
                    WHERE part_number = $2
                `, [item.amountToOrder, item.partNumber]);

                await pool.query(`
                    UPDATE products
                    SET price = ($1)::money,
                        mark_up_price = ($1 * quantity_of_item)::money
                    WHERE part_number = $2
                `, [costPerItem, item.partNumber]);
            }
        }

        await pool.query('COMMIT');
        await logJobsAction('Update Order Details', req.username, 'Order Status Update', {
            message: 'Updated the order details',
            details: { ...req.invoiceId, invoiceId, status: status, total_cost: total_cost } 
        });

        res.json({ message: "Order status, inventory, and markup prices updated successfully." });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error during transaction:', err.message);
        res.status(500).json('Server error');
    }
});


router.post('/add-to-new-order/:invoiceId', authorization, async (req, res) => {
    const { invoiceId } = req.params;
    const { partNumber, quantity, source, amount_to_order } = req.body; 
    
    const order = await pool.query('SELECT status FROM invoices WHERE invoice_id = $1', [invoiceId]);
    if (order.rows[0].status === "Generated" || order.rows[0].status === "Received") {
        return res.status(403).json({ message: "Modifications are not allowed for generated or received orders." });
    }

    try {
        
        await pool.query('BEGIN');
    
        await pool.query(`
            INSERT INTO new_orders (invoice_id, part_number, quantity, amount_to_order)
            VALUES ($1, $2, $3, $4)
        `, [invoiceId, partNumber, quantity, amount_to_order]);

        
        if (source === 'lowInventory') {
            await pool.query(`
                DELETE FROM low_inventory WHERE part_number = $1
            `, [partNumber]);
        } else if (source === 'outOfStock') {
            await pool.query(`
                DELETE FROM out_of_stock WHERE part_number = $1
            `, [partNumber]);
        }

        await logJobsAction('Add', req.username, 'New Order', {
            message: 'Added item to new order',
            details: { ...req.invoiceId,invoiceId,  ...req.body } 
        });
        
        await pool.query('COMMIT');

        res.json({ message: "Item added to new order successfully." });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error executing query:', err.stack);
        res.status(500).json('Server error');
    }
});


router.post('/remove-from-new-order/:invoiceId', authorization, async (req, res) => {
    const { invoiceId } = req.params;
    const { partNumber, quantity } = req.body;

    
    const order = await pool.query('SELECT status FROM invoices WHERE invoice_id = $1', [invoiceId]);
    if (order.rows[0].status === "Generated" || order.rows[0].status === "Received") {
        return res.status(403).json({ message: "Modifications are not allowed for generated or received orders." });
    }

    
    await pool.query('BEGIN');

    try {
        
        await pool.query(
            `DELETE FROM new_orders WHERE part_number = $1 AND invoice_id = $2`,
            [partNumber, invoiceId]
        );

        
        const targetTable = quantity > 0 ? 'low_inventory' : 'out_of_stock';
        await pool.query(
            `INSERT INTO ${targetTable} (invoice_id, part_number, quantity)
            VALUES ($1, $2, $3)
            ON CONFLICT (invoice_id, part_number)
            DO UPDATE SET quantity = EXCLUDED.quantity;`,
            [invoiceId, partNumber, quantity]
        );

        await logJobsAction('Update', req.username, targetTable, {
            message: `Item returned to ${targetTable}`,
            details: { ...req.invoiceId,invoiceId, ...req.body } 
        });

        await pool.query('COMMIT');
        res.json({ message: "Item moved back successfully." });
    } catch (error) {
        
        await pool.query('ROLLBACK');
        console.error('Error during transaction', error);
        res.status(500).json({ message: 'Server error during transaction' });
    }
});

router.post('/:invoiceId/update-amounts', authorization, async (req, res) => {
    const { invoiceId } = req.params;
    const { items } = req.body;

    try {
        await pool.query('BEGIN');

        for (const { partNumber, amountToOrder } of items) {
            // Fetch the current amount to order for comparison
            const currentAmountRes = await pool.query(
                `SELECT amount_to_order FROM new_orders WHERE invoice_id = $1 AND part_number = $2`,
                [invoiceId, partNumber]
            );

            // If there's a record and the amount has changed, update and log
            if (currentAmountRes.rows.length > 0) {
                const currentAmount = currentAmountRes.rows[0].amount_to_order;

                if (currentAmount !== amountToOrder) {
                    await pool.query(`
                        UPDATE new_orders
                        SET amount_to_order = $1
                        WHERE invoice_id = $2 AND part_number = $3
                    `, [amountToOrder, invoiceId, partNumber]);

                    // Log the change for this item
                    await logJobsAction('After Update', req.username, 'Order Amounts', {
                        message: 'Order amount updated successfully',
                        details: { invoiceId, partNumber, oldAmount: currentAmount, newAmount: amountToOrder }
                    });
                }
            }
        }

        await pool.query('COMMIT');
        res.json({ message: "Amounts to order updated successfully." });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Failed to update amounts to order:', error);
        res.status(500).json({ message: "Server error" });
    }
});



router.get('/:invoiceId/generate-xlsx', authorization, async (req, res) => {
    const { invoiceId } = req.params;

    try {
        
        const { rows: newOrderItems } = await pool.query(`
            SELECT p.supplier_part_number, p.description, no.amount_to_order
            FROM new_orders no
            JOIN products p ON no.part_number = p.part_number
            WHERE no.invoice_id = $1;
        `, [invoiceId]);

        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('New Order');

        
        worksheet.columns = [
            { header: 'Item', key: 'supplier_part_number', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Quantity', key: 'amount_to_order', width: 20 }
        ];

        
        worksheet.addRows(newOrderItems);

        
        const buffer = await workbook.xlsx.writeBuffer();

        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="New_Order.xlsx"');
        res.send(buffer);
    } catch (error) {
        console.error('Error generating XLSX:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:invoiceId', authorization, async (req, res) => {
    const { invoiceId } = req.params;
    try {
        // Get details before deletion for logging
        const invoiceDetails = await pool.query('SELECT * FROM invoices WHERE invoice_id = $1', [invoiceId]);

        await pool.query('BEGIN');
        await pool.query('DELETE FROM new_orders WHERE invoice_id = $1', [invoiceId]);
        await pool.query('DELETE FROM low_inventory WHERE invoice_id = $1', [invoiceId]);
        await pool.query('DELETE FROM out_of_stock WHERE invoice_id = $1', [invoiceId]);
        await pool.query('DELETE FROM invoices WHERE invoice_id = $1', [invoiceId]);
        await pool.query('COMMIT');

        // Log the delete action
        await logJobsAction('Delete', req.username, 'Invoice Deletion', {
            message: 'Invoice and all related records deleted',
            details: { ...req.invoiceId, invoiceId, ...req.body } 
        });

        res.json({ message: 'Order successfully deleted.' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Failed to delete order:', error);
        res.status(500).json('Server error');
    }
});



router.patch('/:invoiceId/edit-total-cost', authorization, async (req, res) => {
    const { invoiceId } = req.params;
    const { total_cost } = req.body;

    try {
        await pool.query('UPDATE invoices SET total_cost = $1 WHERE invoice_id = $2', [total_cost, invoiceId]);

        await logJobsAction('Update', req.username, 'Invoice Total Cost', {
            message: 'Total cost updated',
            details: { ...req.invoiceId, invoiceId, ...req.body } 
        });
        res.json({ message: "Total cost updated successfully." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});


module.exports = router;
