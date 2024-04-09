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
        const allJobs = await pool.query('SELECT * FROM jobs ORDER BY job_id DESC');
        res.json(allJobs.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
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
        const newJob = await pool.query(`
            INSERT INTO jobs (
                customer_name, 
                address, 
                phone, 
                email
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [customer_name, address, phone, email]);

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

    try {
        // Check if the part already exists for the job
        const existingPart = await pool.query(
            'SELECT * FROM necessary_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        if (existingPart.rows.length > 0) {
            // Part exists, update the quantity
            const newQuantity = parseFloat(existingPart.rows[0].quantity_required) + parseFloat(quantity_required);
            await pool.query(
                'UPDATE necessary_parts SET quantity_required = $1 WHERE job_id = $2 AND part_number = $3',
                [newQuantity, job_id, part_number]
            );
        } else {
            // Part does not exist, insert a new record
            await pool.query(
                'INSERT INTO necessary_parts (job_id, part_number, quantity_required) VALUES ($1, $2, $3)',
                [job_id, part_number, quantity_required]
            );
        }

        // Fetch and return the updated part data including the price
        const updatedPartData = await pool.query(`
            SELECT np.*, p.price
            FROM necessary_parts np
            JOIN products p ON np.part_number = p.part_number
            WHERE np.job_id = $1 AND np.part_number = $2;
        `, [job_id, part_number]);

        if (updatedPartData.rows.length > 0) {
            res.json(updatedPartData.rows[0]);
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
            SELECT np.*, p.price
            FROM necessary_parts np
            JOIN products p ON np.part_number = p.part_number
            WHERE np.job_id = $1;
        `, [job_id]);

        if (necessaryPartsQuery.rows.length > 0) {
            res.json(necessaryPartsQuery.rows);
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
        // Start a transaction
        await pool.query('BEGIN');

        // Check the inventory for the part
        const inventoryResult = await pool.query(
            'SELECT quantity_in_stock FROM inventory WHERE part_number = $1',
            [part_number]
        );

        if (inventoryResult.rows.length === 0) {
            throw new Error('Part does not exist in inventory');
        }

        const availableStock = inventoryResult.rows[0].quantity_in_stock;

        // Calculate the actual quantity to move based on available stock
        const actualQuantityToMove = Math.min(availableStock, quantity_to_move);

        // Update the inventory
        await pool.query(
            'UPDATE inventory SET quantity_in_stock = quantity_in_stock - $1 WHERE part_number = $2',
            [actualQuantityToMove, part_number]
        );

        // Proceed with moving to used parts as before, using actualQuantityToMove
        // Check if the part already exists in used_parts
        const existingUsedPart = await pool.query(
            'SELECT * FROM used_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        if (existingUsedPart.rows.length > 0) {
            // Update the quantity if it exists
            const newQuantity = parseFloat(existingUsedPart.rows[0].quantity_used) + actualQuantityToMove;
            await pool.query(
                'UPDATE used_parts SET quantity_used = $1 WHERE job_id = $2 AND part_number = $3',
                [newQuantity, job_id, part_number]
            );
        } else {
            // Insert as new entry if it doesn't exist
            await pool.query(
                'INSERT INTO used_parts (job_id, part_number, quantity_used) VALUES ($1, $2, $3)',
                [job_id, part_number, actualQuantityToMove]
            );
        }

        // Remove or update the quantity from necessary_parts
        await pool.query(
            'UPDATE necessary_parts SET quantity_required = quantity_required - $1 WHERE job_id = $2 AND part_number = $3',
            [actualQuantityToMove, job_id, part_number]
        );

        // Commit the transaction
        await pool.query('COMMIT');
        // Send a message back indicating partial fulfillment if applicable
        if (availableStock < quantity_to_move) {
            res.json({
                message: `Only ${actualQuantityToMove} of ${part_number} could be moved due to inventory limits.`,
                actualQuantityMoved: actualQuantityToMove
            });
        } else {
            res.json({ 
                message: `Part moved to used successfully`,
                actualQuantityMoved: actualQuantityToMove
            });
        }
    } catch (err) {
        // Rollback the transaction on error
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Failed to move part to used', detail: err.message });
    }
});




router.get('/:job_id/used-parts', async (req, res) => {
    const { job_id } = req.params;

    try {
        const usedPartsQuery = await pool.query(`
            SELECT up.*, p.price
            FROM used_parts up
            JOIN products p ON up.part_number = p.part_number
            WHERE up.job_id = $1;
        `, [job_id]);

        res.json(usedPartsQuery.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch used parts' });
    }
});



module.exports = router;
