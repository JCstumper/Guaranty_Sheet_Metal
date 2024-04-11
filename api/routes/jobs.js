// routes/jobs.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path'); // Import path module
const router = express.Router();
const pool = require('../db'); // make sure the path to db.js is correct

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Ensure this uploads directory exists
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
// Multer upload setup
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const allJobsQuery = 'SELECT *, to_char(date_created, \'YYYY-MM-DD HH24:MI:SS\') AS formatted_date FROM jobs ORDER BY job_id DESC';
        const allJobs = await pool.query(allJobsQuery);
        res.json(allJobs.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});
// In your jobs router (e.g., jobs.js)

router.get('/search', async (req, res) => {
    const { query } = req.query;  // Assuming you pass the search term as a query parameter
    try {
        const searchQuery = `
            SELECT *, to_char(date_created, 'YYYY-MM-DD HH24:MI:SS') AS formatted_date FROM jobs
            WHERE
                CAST(job_id AS TEXT) ILIKE $1 OR
                customer_name ILIKE $1 OR
                address ILIKE $1 OR
                phone ILIKE $1 OR
                email ILIKE $1 OR
                to_char(date_created, 'YYYY-MM-DD HH24:MI:SS') ILIKE $1;
        `;
        const searchResults = await pool.query(searchQuery, [`%${query}%`]);
        res.json(searchResults.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/estimate/:job_id', async (req, res) => {
    try {
        const { job_id } = req.params;
        const estimateQuery = await pool.query(
            'SELECT * FROM estimates WHERE job_id = $1',
            [job_id]
        );

        if (estimateQuery.rows.length > 0) {
            const estimate = estimateQuery.rows[0];
            // You might want to convert the binary data to a suitable format or handle it directly in the frontend
            res.json(estimate);
        } else {
            res.status(404).json({ error: 'Estimate not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch estimate' });
    }
});

// Route to check if an estimate exists for a job
router.get('/check-estimate/:jobId', async (req, res) => {
    const jobId = parseInt(req.params.jobId);
    if (isNaN(jobId)) {
        return res.status(400).json({ error: "Invalid job ID provided" });
    }

    try {
        const result = await pool.query('SELECT 1 FROM estimates WHERE job_id = $1 LIMIT 1', [jobId]);
        const hasEstimate = result.rows.length > 0;
        res.json({ hasEstimate });
    } catch (err) {
        console.error('Error checking estimate existence:', err.message);
        res.status(500).json({ error: 'Failed to check for existing estimate' });
    }
});

router.post('/', async (req, res) => {
    try {
        // Extract the relevant fields from the request body
        const { customer_name, address, phone, email } = req.body;

        // Insert a new job into the database with the provided fields
        const newJobQuery = `
            INSERT INTO jobs (customer_name, address, phone, email, date_created)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *, to_char(date_created, 'YYYY-MM-DD HH24:MI:SS') AS formatted_date;
        `;
        const newJob = await pool.query(newJobQuery, [customer_name, address, phone, email]);

        // Respond with the newly added job and a success message
        res.status(201).json({
            message: 'Job added successfully',
            job: newJob.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add job' });
    }
});
// POST route to upload an estimate file
router.post('/upload-estimate', upload.single('estimatePdf'), async (req, res) => {
    try {
        const { job_id } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Optionally, check if the uploaded file is a PDF
        if (path.extname(file.originalname) !== '.pdf') {
            fs.unlinkSync(file.path); // Remove the uploaded file
            return res.status(400).json({ error: 'Only PDF files are allowed' });
        }

        const fileData = fs.readFileSync(file.path);
        const result = await pool.query(
            'INSERT INTO estimates (job_id, pdf_data) VALUES ($1, $2) RETURNING *;',
            [job_id, fileData]
        );

        fs.unlinkSync(file.path); // Remove the file after saving to the database

        res.status(201).json({
            message: 'Estimate uploaded successfully',
            estimate: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to upload estimate' });
    }
});
router.delete('/remove-estimate/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const deleteEstimateQuery = 'DELETE FROM estimates WHERE job_id = $1 RETURNING *;';
        
        const result = await pool.query(deleteEstimateQuery, [jobId]);
        
        if (result.rows.length > 0) {
            res.json({ message: 'Estimate removed successfully', deletedEstimate: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Estimate not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to remove estimate' });
    }
});

router.post('/necessary-parts', async (req, res) => {
    const { job_id, part_number, quantity_required } = req.body;
    const integerQuantityRequired = parseInt(quantity_required, 10); // Ensure integer conversion

    try {
        // Check if the part already exists for the job
        const existingPart = await pool.query(
            'SELECT * FROM necessary_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        if (existingPart.rows.length > 0) {
            // Part exists, update the quantity
            const newQuantity = existingPart.rows[0].quantity_required + integerQuantityRequired;
            await pool.query(
                'UPDATE necessary_parts SET quantity_required = $1 WHERE job_id = $2 AND part_number = $3',
                [newQuantity, job_id, part_number]
            );
        } else {
            // Part does not exist, insert a new record
            await pool.query(
                'INSERT INTO necessary_parts (job_id, part_number, quantity_required) VALUES ($1, $2, $3)',
                [job_id, part_number, integerQuantityRequired]
            );
        }

        // Fetch and return the updated part data including the price
        const updatedPartData = await pool.query(`
            SELECT np.*, CAST(p.price AS NUMERIC) AS price
            FROM necessary_parts np
            JOIN products p ON np.part_number = p.part_number
            WHERE np.job_id = $1 AND np.part_number = $2;
        `, [job_id, part_number]);

        if (updatedPartData.rows.length > 0) {
            const partData = updatedPartData.rows[0];
            partData.price = parseFloat(partData.price); // Ensure price is a floating-point number
            res.json(partData);
        } else {
            res.status(404).json({ message: 'Part not found after update or insert.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add or update necessary part' });
    }
});



// Make sure this matches the base URL and route structure you have defined
router.get('/:job_id/necessary-parts', async (req, res) => {
    const { job_id } = req.params;

    try {
        const necessaryPartsQuery = await pool.query(`
            SELECT np.id, np.job_id, np.part_number, np.quantity_required, 
                   CAST(p.price AS NUMERIC) AS price, p.description
            FROM necessary_parts np
            JOIN products p ON np.part_number = p.part_number
            WHERE np.job_id = $1;
        `, [job_id]);

        if (necessaryPartsQuery.rows.length > 0) {
            // Ensure the price is properly formatted for each part
            const partsWithFormattedPrice = necessaryPartsQuery.rows.map(part => ({
                ...part,
                price: parseFloat(part.price)  // Ensure price is a floating-point number
            }));

            res.json(partsWithFormattedPrice);
        } else {
            res.status(404).json({ message: 'No necessary parts found for this job.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch necessary parts' });
    }
});

router.put('/necessary-parts/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity_required } = req.body;

    if (quantity_required < 0) {
        return res.status(400).json({ error: 'Quantity cannot be negative.' });
    }

    try {
        const updatedPart = await pool.query(
            'UPDATE necessary_parts SET quantity_required = $1 WHERE id = $2 RETURNING *',
            [quantity_required, id]
        );

        if (updatedPart.rows.length > 0) {
            res.json(updatedPart.rows[0]);
        } else {
            res.status(404).json({ message: 'Necessary part not found.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to update necessary part' });
    }
});

router.delete('/necessary-parts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await pool.query(
            'DELETE FROM necessary_parts WHERE id = $1 RETURNING *',
            [id]
        );

        if (deleteResult.rows.length > 0) {
            res.json({ message: 'Necessary part removed successfully' });
        } else {
            res.status(404).json({ message: 'Necessary part not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to remove necessary part' });
    }
});
router.post('/:job_id/move-to-used', async (req, res) => {
    const { job_id } = req.params;
    const { part_number, quantity_to_move } = req.body;

    try {
        await pool.query('BEGIN');

        const inventoryResult = await pool.query(
            'SELECT quantity_in_stock FROM inventory WHERE part_number = $1',
            [part_number]
        );

        if (inventoryResult.rows.length === 0 || inventoryResult.rows[0].quantity_in_stock <= 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: `No available stock for part ${part_number} or requested quantity is invalid` });
        }

        const availableStock = inventoryResult.rows[0].quantity_in_stock;
        const actualQuantityToMove = Math.min(availableStock, quantity_to_move);

        if (actualQuantityToMove <= 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: `Cannot move part ${part_number} as the requested quantity exceeds available stock.` });
        }

        await pool.query(
            'UPDATE inventory SET quantity_in_stock = quantity_in_stock - $1 WHERE part_number = $2',
            [actualQuantityToMove, part_number]
        );

        const existingUsedPart = await pool.query(
            'SELECT * FROM used_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        if (existingUsedPart.rows.length > 0) {
            await pool.query(
                'UPDATE used_parts SET quantity_used = quantity_used + $1 WHERE job_id = $2 AND part_number = $3',
                [actualQuantityToMove, job_id, part_number]
            );
        } else {
            await pool.query(
                'INSERT INTO used_parts (job_id, part_number, quantity_used) VALUES ($1, $2, $3)',
                [job_id, part_number, actualQuantityToMove]
            );
        }

        const updateNecessaryPartsResult = await pool.query(
            'UPDATE necessary_parts SET quantity_required = quantity_required - $1 WHERE job_id = $2 AND part_number = $3 RETURNING quantity_required',
            [actualQuantityToMove, job_id, part_number]
        );

        if (updateNecessaryPartsResult.rows[0].quantity_required <= 0) {
            await pool.query(
                'DELETE FROM necessary_parts WHERE job_id = $1 AND part_number = $2',
                [job_id, part_number]
            );
        }

        await pool.query('COMMIT');

        res.json({
            message: `Part moved to used successfully. ${actualQuantityToMove} of ${part_number} moved.`,
            actualQuantityMoved: actualQuantityToMove
        });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Failed to move part to used', detail: err.message });
    }
});

router.post('/used-parts', async (req, res) => {
    const { job_id, part_number, quantity_used } = req.body;
    const integerQuantityUsed = parseInt(quantity_used, 10); // Ensure integer conversion

    if (integerQuantityUsed <= 0) {
        return res.status(400).json({ error: 'Quantity used must be greater than 0.' });
    }

    try {
        // Begin transaction
        await pool.query('BEGIN');

        // Check if the part already exists in the used_parts table for the job
        const existingUsedPart = await pool.query(
            'SELECT * FROM used_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        // Check inventory stock
        const inventoryCheck = await pool.query(
            'SELECT quantity_in_stock FROM inventory WHERE part_number = $1',
            [part_number]
        );
        if (inventoryCheck.rows.length === 0 || inventoryCheck.rows[0].quantity_in_stock < integerQuantityUsed) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Insufficient inventory for this part.' });
        }

        // Update inventory
        await pool.query(
            'UPDATE inventory SET quantity_in_stock = quantity_in_stock - $1 WHERE part_number = $2',
            [integerQuantityUsed, part_number]
        );

        if (existingUsedPart.rows.length > 0) {
            // Part exists in used_parts, update the quantity_used
            await pool.query(
                'UPDATE used_parts SET quantity_used = quantity_used + $1 WHERE job_id = $2 AND part_number = $3',
                [integerQuantityUsed, job_id, part_number]
            );
        } else {
            // Part does not exist in used_parts, insert a new record
            await pool.query(
                'INSERT INTO used_parts (job_id, part_number, quantity_used) VALUES ($1, $2, $3)',
                [job_id, part_number, integerQuantityUsed]
            );
        }

        // Fetch and return the updated part data including the price
        const updatedUsedPartData = await pool.query(`
            SELECT up.*, CAST(p.price AS NUMERIC) AS price
            FROM used_parts up
            JOIN products p ON up.part_number = p.part_number
            WHERE up.job_id = $1 AND up.part_number = $2;
        `, [job_id, part_number]);

        await pool.query('COMMIT');

        if (updatedUsedPartData.rows.length > 0) {
            const partData = updatedUsedPartData.rows[0];
            partData.price = parseFloat(partData.price); // Ensure price is a floating-point number
            res.json(partData);
        } else {
            res.status(404).json({ message: 'Part not found after update or insert.' });
        }
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add or update used part' });
    }
});


router.get('/:job_id/used-parts', async (req, res) => {
    const { job_id } = req.params;

    try {
        const usedPartsQuery = await pool.query(`
            SELECT up.id, up.job_id, up.part_number, up.quantity_used,
                   CAST(p.price AS NUMERIC) AS price, p.description
            FROM used_parts up
            JOIN products p ON up.part_number = p.part_number
            WHERE up.job_id = $1;
        `, [job_id]);

        if (usedPartsQuery.rows.length > 0) {
            const partsWithFormattedPrice = usedPartsQuery.rows.map(part => ({
                ...part,
                price: parseFloat(part.price) // Ensure price is a floating-point number
            }));
            res.json(partsWithFormattedPrice);
        } else {
            res.status(404).json({ message: 'No used parts found for this job.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch used parts' });
    }
});


router.post('/:job_id/return-to-necessary', async (req, res) => {
    const { job_id } = req.params;
    const { part_id, quantity_used } = req.body;

    try {
        await pool.query('BEGIN');

        // Fetch part_number using part_id from used_parts
        const partRes = await pool.query('SELECT part_number FROM used_parts WHERE id = $1', [part_id]);
        if (partRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Part not found in used_parts' });
        }
        const { part_number } = partRes.rows[0];

        // Check if part exists in necessary_parts
        const necessaryPartRes = await pool.query(
            'SELECT quantity_required FROM necessary_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        if (necessaryPartRes.rows.length > 0) {
            // Update necessary_parts if part exists
            await pool.query(
                'UPDATE necessary_parts SET quantity_required = quantity_required + $1 WHERE job_id = $2 AND part_number = $3',
                [quantity_used, job_id, part_number]
            );
        } else {
            // Insert into necessary_parts if part does not exist
            await pool.query(
                'INSERT INTO necessary_parts (job_id, part_number, quantity_required) VALUES ($1, $2, $3)',
                [job_id, part_number, quantity_used]
            );
        }

        // Update inventory
        await pool.query(
            'UPDATE inventory SET quantity_in_stock = quantity_in_stock + $1 WHERE part_number = $2',
            [quantity_used, part_number]
        );

        // Remove from used_parts
        await pool.query('DELETE FROM used_parts WHERE id = $1', [part_id]);

        await pool.query('COMMIT');
        res.json({ message: 'Part returned to necessary successfully' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error returning part to necessary:', err);
        res.status(500).json({ error: 'Failed to return part to necessary', detail: err.message });
    }
});

// Assuming you're adding this inside routes/jobs.js or a similar file

router.post('/:job_id/update-used-part', async (req, res) => {
    const { job_id } = req.params;
    const { part_id, new_quantity, quantity_diff } = req.body;

    try {
        await pool.query('BEGIN');

        // Fetch current data for the used part
        const usedPartRes = await pool.query('SELECT part_number, quantity_used FROM used_parts WHERE id = $1', [part_id]);
        if (usedPartRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Used part not found' });
        }

        const { part_number } = usedPartRes.rows[0];

        // Update used parts with the new quantity
        await pool.query('UPDATE used_parts SET quantity_used = $1 WHERE id = $2', [new_quantity, part_id]);

        // Adjust inventory based on the quantity difference
        if (quantity_diff > 0) {
            // Decrease inventory
            await pool.query('UPDATE inventory SET quantity_in_stock = quantity_in_stock - $1 WHERE part_number = $2', [quantity_diff, part_number]);
        } else if (quantity_diff < 0) {
            // Increase inventory (Note the use of ABS to make the negative diff positive)
            await pool.query('UPDATE inventory SET quantity_in_stock = quantity_in_stock + $1 WHERE part_number = $2', [Math.abs(quantity_diff), part_number]);
        }


        // If necessary, update necessary parts (this part may depend on your business logic)
        // For example, if decreasing used parts, you might want to increase necessary parts

        await pool.query('COMMIT');
        res.json({ message: 'Used part updated successfully' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error updating used part:', err);
        res.status(500).json({ error: 'Failed to update used part', detail: err.message });
    }
});


router.post('/:job_id/remove-from-used', async (req, res) => {
    const { job_id } = req.params;
    const { part_number, quantity_used } = req.body;

    try {
        await pool.query('BEGIN');

        // Add the quantity back to the inventory
        await pool.query(
            'UPDATE inventory SET quantity_in_stock = quantity_in_stock + $1 WHERE part_number = $2',
            [quantity_used, part_number]
        );

        // Remove the part from the used parts
        await pool.query(
            'DELETE FROM used_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        await pool.query('COMMIT');
        res.json({ message: `Part ${part_number} removed from used.` });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Failed to remove part from used' });
    }
});

// DELETE endpoint to remove a job
router.delete('/:job_id', async (req, res) => {
    const { job_id } = req.params;

    try {
        const deleteQuery = 'DELETE FROM jobs WHERE job_id = $1';
        const result = await pool.query(deleteQuery, [job_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: `Job ${job_id} not found` });
        }

        res.status(200).json({ message: `Job ${job_id} removed successfully` });
    } catch (err) {
        console.error('Error removing job:', err);
        res.status(500).json({ error: 'Failed to remove job', detail: err.message });
    }
});
//to update a job
router.put('/:job_id', async (req, res) => {
    const { job_id } = req.params;
    const { customer_name, address, phone, email } = req.body; // include other fields as necessary

    try {
        const updateQuery = `
            UPDATE jobs
            SET customer_name = $1, address = $2, phone = $3, email = $4
            WHERE job_id = $5
            RETURNING *;`;

        const result = await pool.query(updateQuery, [customer_name, address, phone, email, job_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `Job ${job_id} not found` });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating job:', err);
        res.status(500).json({ error: 'Failed to update job', detail: err.message });
    }
});


module.exports = router;
