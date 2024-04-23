const express = require('express');
const router = express.Router();
const pool = require('../db');
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
        const products = await pool.query(`
        SELECT * FROM products
        `);
        res.json({products});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authorization, async (req, res) => {
    try {
        const {
            partNumber,
            supplierPartNumber,
            radiusSize,
            materialType,
            color,
            description,
            type,
            quantityOfItem,
            unit,
            price,
            markUpPrice,
        } = req.body;

        if (!partNumber || !price || !supplierPartNumber || !materialType || !description || !type || !quantityOfItem) { 
            return res.status(400).json({ error: 'Missing required fields' });
        }

        
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
        `, [partNumber, 0]); 
        
        
        await logInventoryAction('Add Product', req.username, 'Inventory', { 
            message: 'Product Added', 
            details: { ...req.body } 
        });

        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Duplicate entry', details: err.detail });
        }
        res.status(500).json({ error: 'Internal server error', message: err.message });
    }
});

router.delete('/:partNumber', authorization, async (req, res) => {
    try {
        const { partNumber } = req.params;
        
        const productDeletionResponse = await pool.query(`
            DELETE FROM products
            WHERE part_number = $1
            RETURNING *;
        `, [partNumber]);
        
        
        await logInventoryAction('Delete Product', req.username, 'Inventory', { 
            message: 'Product Deleted',
            details: productDeletionResponse.rows[0]
        });

        
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

router.put('/:originalPartNumber', authorization, async (req, res) => {
    const client = await pool.connect();
    try {
        const { originalPartNumber } = req.params;
        const {
            partNumber,   
            supplierPartNumber,
            radiusSize,      
            materialType,    
            color,           
            description,     
            type,            
            oldType,
            quantityOfItem,  
            unit,            
            price,           
            markUpPrice,      
            catCode
        } = req.body;

        
        await client.query('BEGIN');
        if (partNumber === originalPartNumber) {
            
            const updateProductQuery = `
                UPDATE products
                SET 
                    supplier_part_number = $1,
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
            
            const insertProductQuery = `
                INSERT INTO products (part_number, supplier_part_number, radius_size, material_type, color, description, type, quantity_of_item, unit, price, mark_up_price)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
            `;
            await client.query(insertProductQuery, [partNumber, supplierPartNumber, radiusSize, materialType, color, description, type, quantityOfItem, unit, price, markUpPrice]);

            
            const updateInventoryQuery = `
                UPDATE inventory
                SET part_number = $1
                WHERE part_number = $2;
            `;
            await client.query(updateInventoryQuery, [partNumber, originalPartNumber]);

            const deleteOldProductQuery = `DELETE FROM products WHERE part_number = $1;`;
            await client.query(deleteOldProductQuery, [originalPartNumber]);
        }

        if (oldType !== type) {
            
            const checkForOldType = `SELECT * FROM products WHERE type = $1;`;
            const resultOldType = await client.query(checkForOldType, [oldType]);
            if (resultOldType.rows.length === 0) {
                
                const deleteFromMappings = `DELETE FROM category_mappings WHERE category = $1;`;
                await client.query(deleteFromMappings, [oldType]);
            }

            
            const checkForNewType = `SELECT * FROM category_mappings WHERE category = $1;`;
            const resultNewType = await client.query(checkForNewType, [type]);
            if (resultNewType.rows.length === 0) {
                
                
                const keywords = type.split(/\s+/); 

                
                const insertIntoMappings = `
                    INSERT INTO category_mappings (category, keywords, catcode) 
                    VALUES ($1, $2, $3);
                `;
                await client.query(insertIntoMappings, [type, keywords, catCode]);
            }
        }

        if (!partNumber || !price || !supplierPartNumber || !materialType || !description || !type || !quantityOfItem) {
            return res.status(400).json({ error: 'Validation error', message: 'Required fields not entered.' });
        }

        
        await logInventoryAction('Update Product', req.username, 'Inventory', { 
            message: 'Product Information Updated', 
            details: { ...req.body } 
        });

        
        await client.query('COMMIT');

        res.json({ message: 'Product and inventory updated successfully.' });
    } catch (err) {
        console.error(err.message);
        let userMessage = 'Failed to update product and inventory';
        if (err.code === '23505') {
            userMessage = 'Duplicate entry for part number';
        }
        res.status(500).json({ error: 'Database error', message: userMessage, details: err.detail });
    } finally {
        client.release();
    }
});

router.get('/with-inventory', authorization, async (req, res) => {
    try {
        
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
            SELECT part_number, radius_size, description
            FROM products
            WHERE part_number ILIKE $1 OR description ILIKE $1
            ORDER BY part_number;
        `;
        const results = await pool.query(query, [`%${searchTerm}%`]);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error searching for products' });
    }
});




router.get('/category/:category', authorization, async (req, res) => {
    try {
        const { category } = req.params;
        
        const products = await pool.query(`
            SELECT * FROM products WHERE type = $1;
        `, [category]);
        
        if(products.rowCount === 0) {
            await pool.query('DELETE FROM category_mappings WHERE category = $1 RETURNING *', [category]);
        }

        res.json({
            message: `Products fetched successfully for category: ${category}`,
            products: products.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
});

module.exports = router;
module.exports.logInventoryAction = logInventoryAction; 