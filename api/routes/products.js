// routes/products.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // make sure the path to db.js is correct

router.get('/', async (req, res) => {
    try {
        const products = await pool.query(`
        SELECT * FROM products
        `);
        res.json({products});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        // Extracting fields from req.body based on the structure provided earlier
        const {
            partNumber,      // Maps to 'part_number'
            supplierPartNumber,
            radiusSize,      // Originally 'size', now correctly mapped to 'radius_size'
            materialType,    // Maps to 'material_type'
            color,           // New addition, maps to 'color'
            description,     // Maps to 'description'
            type,            // Maps to 'type'
            quantityOfItem,  // Maps to 'quantity_of_item', adjusted for decimal type
            unit,            // Maps to 'unit'
            price,           // Maps to 'price', note: handling MONEY type correctly is important
            markUpPrice      // Maps to 'mark_up_price', same note on MONEY type
        } = req.body;

        // Ensure the SQL query matches your database schema
        const newProduct = await pool.query(`
        INSERT INTO products (
            part_number,
            supplier_part_number,
            radius_size, 
            material_type, 
            color, 
            description, 
            type, 
            quantity_of_item, 
            unit, 
            price, 
            mark_up_price
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
        `, [partNumber, supplierPartNumber, radiusSize, materialType, color, description, type, quantityOfItem, unit, price, markUpPrice]);

        await pool.query(`
            INSERT INTO inventory (part_number, quantity_in_stock)
            VALUES ($1, $2) RETURNING *;
        `, [partNumber, 0]); // Use the partNumber from req.body and a default quantity of 0

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

router.delete('/:partNumber', async (req, res) => {
    try {
        const { partNumber } = req.params;

        // First, delete any related inventory records for the product to avoid foreign key constraints.
        // This assumes that `part_number` is used as a reference in your `inventory` table.
        const inventoryDeletionResponse = await pool.query(`
            DELETE FROM inventory
            WHERE part_number = $1;
        `, [partNumber]);

        console.log(`Deleted ${inventoryDeletionResponse.rowCount} inventory record(s) for part number: ${partNumber}`);

        // Then, delete the product from the products table.
        const productDeletionResponse = await pool.query(`
            DELETE FROM products
            WHERE part_number = $1
            RETURNING *;
        `, [partNumber]);

        // Check if a product was actually deleted. If not, the product was not found.
        if (productDeletionResponse.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            message: 'Product and associated inventory records deleted successfully',
            deletedProduct: productDeletionResponse.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

router.put('/:originalPartNumber', async (req, res) => {
    const client = await pool.connect();
    try {
        const { originalPartNumber } = req.params;
        const {
            newPartNumber,   // New part number to update
            supplierPartNumber,
            radiusSize,      // Maps to 'radius_size'
            materialType,    // Maps to 'material_type'
            color,           // Maps to 'color'
            description,     // Maps to 'description'
            type,            // Maps to 'type'
            quantityOfItem,  // Maps to 'quantity_of_item'
            unit,            // Maps to 'unit'
            price,           // Maps to 'price'
            markUpPrice      // Maps to 'mark_up_price'
        } = req.body;

        // Begin transaction
        await client.query('BEGIN');

        if (newPartNumber === originalPartNumber) {
            // Update existing product details
            const updateProductQuery = `
                UPDATE products
                SET 
                    supplier_part_number = $1
                    radius_size = $2, 
                    material_type = $3, 
                    color = $4, 
                    description = $5, 
                    type = $6, 
                    quantity_of_item = $7, 
                    unit = $8, 
                    price = $9, 
                    mark_up_price = $10
                WHERE part_number = $11;
            `;
            await client.query(updateProductQuery, [supplierPartNumber, radiusSize, materialType, color, description, type, quantityOfItem, unit, price, markUpPrice, originalPartNumber]);
        } else {
            // Insert new product details with the new part number
            const insertProductQuery = `
                INSERT INTO products (part_number, supplier_part_number, radius_size, material_type, color, description, type, quantity_of_item, unit, price, mark_up_price)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT (part_number) DO NOTHING;
            `;
            await client.query(insertProductQuery, [newPartNumber, supplierPartNumber, radiusSize, materialType, color, description, type, quantityOfItem, unit, price, markUpPrice]);

            // Update the inventory record to match the new part number
            const updateInventoryQuery = `
                UPDATE inventory
                SET part_number = $1
                WHERE part_number = $2;
            `;
            await client.query(updateInventoryQuery, [newPartNumber, originalPartNumber]);

            // Optionally, delete the old product if no longer needed
            // const deleteOldProductQuery = `DELETE FROM products WHERE part_number = $1;`;
            // await client.query(deleteOldProductQuery, [originalPartNumber]);
        }

        // Commit transaction
        await client.query('COMMIT');

        res.json({ message: 'Product and inventory updated successfully.' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Failed to update product and inventory', details: err.message });
    } finally {
        client.release();
    }
});

router.get('/with-inventory', async (req, res) => {
    try {
        // Perform a SQL JOIN to fetch products with their inventory quantity
        const productsWithInventory = await pool.query(`
            SELECT p.*, i.quantity_in_stock
            FROM products p
            INNER JOIN inventory i ON p.part_number = i.part_number;
        `);

        res.json({
            message: 'Products with inventory fetched successfully',
            products: productsWithInventory.rows,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch products with inventory' });
    }
});
router.get('/search', async (req, res) => {
    const searchTerm = req.query.term;
    if (!searchTerm) {
        return res.status(400).json({ error: "Search term is required" });
    }

    try {
        const query = `
            SELECT part_number, description
            FROM products
            WHERE description ILIKE $1
            ORDER BY description;
        `;
        const results = await pool.query(query, [`%${searchTerm}%`]);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error searching for products' });
    }
});

module.exports = router;
