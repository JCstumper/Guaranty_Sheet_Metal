const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pool = require('../db');
const authorization = require("../middleware/authorization");


async function logJobsAction(actionType, userId, logType, changeDetails) {
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5242880 },
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname).toLowerCase() === '.pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

router.get('/', authorization, async (req, res) => {
    try {
        const allJobsQuery = `
            SELECT jobs.*, estimates.estimate_id, estimates.file_name AS estimateFileName, to_char(jobs.date_created, 'YYYY-MM-DD HH24:MI:SS') AS formatted_date 
            FROM jobs 
            LEFT JOIN estimates ON jobs.job_id = estimates.job_id
            ORDER BY jobs.job_id DESC
        `;
        const allJobs = await pool.query(allJobsQuery);
        res.json(allJobs.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});

router.get('/search', authorization, async (req, res) => {
    const { query } = req.query;
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

router.get('/estimate/:job_id', authorization, async (req, res) => {
    try {
        const { job_id } = req.params;
        const estimateQuery = await pool.query(
            'SELECT * FROM estimates WHERE job_id = $1',
            [job_id]
        );

        if (estimateQuery.rows.length > 0) {
            const estimate = estimateQuery.rows[0];
            res.json(estimate);
        } else {
            res.status(404).json({ error: 'Estimate not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch estimate' });
    }
});

router.get('/check-estimate/:jobId', authorization, async (req, res) => {
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

router.post('/', authorization, async (req, res) => {
    try {
        const { customer_name, address, phone, email } = req.body;

        const newJobQuery = `
            INSERT INTO jobs (customer_name, address, phone, email, date_created)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *, to_char(date_created, 'YYYY-MM-DD HH24:MI:SS') AS formatted_date;
        `;
        const newJob = await pool.query(newJobQuery, [customer_name, address, phone, email]);

        await logJobsAction("Add Job", req.username, "Job Management", {
            message: "Added",
            details: newJob.rows[0],
        });

        res.status(201).json({
            message: 'Job added successfully',
            job: newJob.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add job' });
    }
});


router.post('/upload-estimate', authorization, upload.single('estimatePdf'), async (req, res) => {
    try {
        const { job_id } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded or file is too large' });
        }

        const fileData = fs.readFileSync(file.path);
        const result = await pool.query(
            'INSERT INTO estimates (job_id, pdf_data, file_name) VALUES ($1, $2, $3) RETURNING *;',
            [job_id, fileData, file.originalname]
        );

        await logJobsAction("Add Estimate", req.username, "estimate", {
            message: "Uploaded",
            details: result.rows[0],
        });

        fs.unlinkSync(file.path);

        res.status(201).json({
            message: 'Estimate uploaded successfully',
            estimate: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({ error: 'File too large. Maximum size is 5MB.' });
        } else {
            res.status(500).json({ error: 'Failed to upload estimate' });
        }
    }
});

router.delete('/remove-estimate/:jobId', authorization, async (req, res) => {
    try {
        const { jobId } = req.params;
        const deleteEstimateQuery = 'DELETE FROM estimates WHERE job_id = $1 RETURNING *;';

        const result = await pool.query(deleteEstimateQuery, [jobId]);

        if (result.rows.length > 0) {
            await logJobsAction("Delete Estimate", req.username, "estimate", {
                message: "Removed",
                details: result.rows[0],
            });

            res.json({ message: 'Estimate removed successfully', deletedEstimate: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Estimate not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to remove estimate' });
    }
});

router.post('/necessary-parts', authorization, async (req, res) => {
    const { job_id, part_number, quantity_required } = req.body;
    const integerQuantityRequired = parseInt(quantity_required, 10);

    try {
        let actionType;

        const existingPart = await pool.query(
            'SELECT * FROM necessary_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        if (existingPart.rows.length > 0) {
            const newQuantity = existingPart.rows[0].quantity_required + integerQuantityRequired;
            const result = await pool.query(
                'UPDATE necessary_parts SET quantity_required = $1 WHERE job_id = $2 AND part_number = $3',
                [newQuantity, job_id, part_number]
            );
            actionType = "Update Necessary Part";

            await logJobsAction(actionType, req.username, "Necessary Parts", {
                message: "Add necessary part",
                details: result.rows[0],
            });
        } else {
            const result = await pool.query(
                'INSERT INTO necessary_parts (job_id, part_number, quantity_required) VALUES ($1, $2, $3)',
                [job_id, part_number, integerQuantityRequired]
            );
            actionType = "Add Necessary Part";

            await logJobsAction(actionType, req.username, "Necessary Parts", {
                message: "Add necessary part",
                details: result.rows[0],
            });
        }

        const updatedPartData = await pool.query(`
            SELECT np.*, CAST(p.mark_up_price AS NUMERIC) AS price
            FROM necessary_parts np
            JOIN products p ON np.part_number = p.part_number
            WHERE np.job_id = $1 AND np.part_number = $2;
        `, [job_id, part_number]);

        if (updatedPartData.rows.length > 0) {
            const partData = updatedPartData.rows[0];
            partData.price = parseFloat(partData.price);
            res.json(partData);
        } else {
            res.status(404).json({ message: 'Part not found after update or insert.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to add or update necessary part' });
    }
});

router.get('/:job_id/necessary-parts', authorization, async (req, res) => {
    const { job_id } = req.params;

    try {
        const necessaryPartsQuery = await pool.query(`
            SELECT np.id, np.job_id, np.part_number, np.quantity_required, CAST(p.mark_up_price AS NUMERIC) AS price, p.description
            FROM necessary_parts np
            JOIN products p ON np.part_number = p.part_number
            WHERE np.job_id = $1;
        `, [job_id]);

        if (necessaryPartsQuery.rows.length > 0) {
            const partsWithFormattedPrice = necessaryPartsQuery.rows.map(part => ({
                ...part,
                price: parseFloat(part.price)
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

router.put('/necessary-parts/:id', authorization, async (req, res) => {
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
            await logJobsAction("Update Necessary Part", req.username, "Necessary Parts", {
                message: "Update",
                details: updatedPart.rows[0]
            });

            res.json(updatedPart.rows[0]);
        } else {
            res.status(404).json({ message: 'Necessary part not found.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to update necessary part' });
    }
});

router.delete('/necessary-parts/:id', authorization, async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await pool.query(
            'DELETE FROM necessary_parts WHERE id = $1 RETURNING *',
            [id]
        );

        if (deleteResult.rows.length > 0) {
            await logJobsAction("Delete Necessary Part", req.username, "Necessary Parts", {
                message: "Delete",
                details: {
                    part_id: id,
                    details: deleteResult.rows[0]
                }
            });

            res.json({ message: 'Necessary part removed successfully', deletedPart: deleteResult.rows[0] });
        } else {
            res.status(404).json({ message: 'Necessary part not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to remove necessary part' });
    }
});


router.post('/:job_id/move-to-used', authorization, async (req, res) => {
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

        await logJobsAction("Move to Used", req.username, "Part Movement", {
            message: `Part moved to used successfully. ${actualQuantityToMove} of ${part_number} moved.`,
            details: actualQuantityToMove
        });

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

router.post('/used-parts', authorization, async (req, res) => {
    const { job_id, part_number, quantity_used } = req.body;
    const integerQuantityUsed = parseInt(quantity_used, 10);

    if (integerQuantityUsed <= 0) {
        return res.status(400).json({ error: 'Quantity used must be greater than 0.' });
    }

    try {
        await pool.query('BEGIN');

        const existingUsedPart = await pool.query(
            'SELECT * FROM used_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        const inventoryCheck = await pool.query(
            'SELECT quantity_in_stock FROM inventory WHERE part_number = $1',
            [part_number]
        );
        if (inventoryCheck.rows.length === 0 || inventoryCheck.rows[0].quantity_in_stock < integerQuantityUsed) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'Insufficient inventory for this part.' });
        }

        await pool.query(
            'UPDATE inventory SET quantity_in_stock = quantity_in_stock - $1 WHERE part_number = $2',
            [integerQuantityUsed, part_number]
        );

        if (existingUsedPart.rows.length > 0) {
            await pool.query(
                'UPDATE used_parts SET quantity_used = quantity_used + $1 WHERE job_id = $2 AND part_number = $3',
                [integerQuantityUsed, job_id, part_number]
            );
        } else {
            await pool.query(
                'INSERT INTO used_parts (job_id, part_number, quantity_used) VALUES ($1, $2, $3)',
                [job_id, part_number, integerQuantityUsed]
            );
        }

        const updatedUsedPartData = await pool.query(`
            SELECT up.*, CAST(p.mark_up_price AS NUMERIC) AS price
            FROM used_parts up
            JOIN products p ON up.part_number = p.part_number
            WHERE up.job_id = $1 AND up.part_number = $2;
        `, [job_id, part_number]);

        await pool.query('COMMIT');

        await logJobsAction("Update Used", req.username, "Part Management", {
            message: "Update",
            details: updatedUsedPartData.rows[0]
        });

        if (updatedUsedPartData.rows.length > 0) {
            const partData = updatedUsedPartData.rows[0];
            partData.price = parseFloat(partData.price);
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

router.get('/:job_id/used-parts', authorization, async (req, res) => {
    const { job_id } = req.params;

    try {
        const usedPartsQuery = await pool.query(`
            SELECT up.id, up.job_id, up.part_number, up.quantity_used, CAST(p.mark_up_price AS NUMERIC) AS price, p.description
            FROM used_parts up
            JOIN products p ON up.part_number = p.part_number
            WHERE up.job_id = $1;
        `, [job_id]);

        if (usedPartsQuery.rows.length > 0) {
            const partsWithFormattedPrice = usedPartsQuery.rows.map(part => ({
                ...part,
                price: parseFloat(part.price)
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

router.post('/:job_id/return-to-necessary', authorization, async (req, res) => {
    const { job_id } = req.params;
    const { part_id, quantity_used } = req.body;

    try {
        await pool.query('BEGIN');

        const partRes = await pool.query('SELECT part_number FROM used_parts WHERE id = $1', [part_id]);
        if (partRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Part not found in used_parts' });
        }
        const { part_number } = partRes.rows[0];

        const necessaryPartRes = await pool.query(
            'SELECT quantity_required FROM necessary_parts WHERE job_id = $1 AND part_number = $2',
            [job_id, part_number]
        );

        if (necessaryPartRes.rows.length > 0) {
            await pool.query(
                'UPDATE necessary_parts SET quantity_required = quantity_required + $1 WHERE job_id = $2 AND part_number = $3',
                [quantity_used, job_id, part_number]
            );
        } else {
            await pool.query(
                'INSERT INTO necessary_parts (job_id, part_number, quantity_required) VALUES ($1, $2, $3)',
                [job_id, part_number, quantity_used]
            );
        }

        await pool.query(
            'UPDATE inventory SET quantity_in_stock = quantity_in_stock + $1 WHERE part_number = $2',
            [quantity_used, part_number]
        );

        await pool.query('DELETE FROM used_parts WHERE id = $1', [part_id]);

        await pool.query('COMMIT');

        await logJobsAction("Return to Necessary", req.username, "Part Management", {
            message: "Part returned to necessary successfully",
            details: {
                job_id: job_id,
                part_number: part_number,
                quantity_returned: quantity_used
            }
        });

        res.json({ message: 'Part returned to necessary successfully' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error returning part to necessary:', err);
        res.status(500).json({ error: 'Failed to return part to necessary', detail: err.message });
    }
});

router.post('/:job_id/update-used-part', authorization, async (req, res) => {
    const { job_id } = req.params;
    const { part_id, new_quantity, quantity_diff } = req.body;

    try {
        await pool.query('BEGIN');

        const usedPartRes = await pool.query('SELECT part_number, quantity_used FROM used_parts WHERE id = $1', [part_id]);
        if (usedPartRes.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'Used part not found' });
        }

        const { part_number } = usedPartRes.rows[0];

        await pool.query('UPDATE used_parts SET quantity_used = $1 WHERE id = $2', [new_quantity, part_id]);

        if (quantity_diff > 0) {
            await pool.query('UPDATE inventory SET quantity_in_stock = quantity_in_stock - $1 WHERE part_number = $2', [quantity_diff, part_number]);
        } else if (quantity_diff < 0) {
            await pool.query('UPDATE inventory SET quantity_in_stock = quantity_in_stock + $1 WHERE part_number = $2', [Math.abs(quantity_diff), part_number]);
        }

        await logJobsAction("Update Used Part", req.username, "Part Management", {
            message: "Used part updated successfully",
            details: {
                job_id: job_id,
                part_id: part_id,
                part_number: part_number,
                new_quantity: new_quantity,
                quantity_diff: quantity_diff
            }
        });

        await pool.query('COMMIT');
        res.json({ message: 'Used part updated successfully' });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error updating used part:', err);
        res.status(500).json({ error: 'Failed to update used part', detail: err.message });
    }
});


router.post('/:job_id/remove-from-used', authorization, async (req, res) => {
    const { job_id } = req.params;
    const { part_number, quantity_used } = req.body;

    try {
        await pool.query('BEGIN');

        const updateInventory = await pool.query(
            'UPDATE inventory SET quantity_in_stock = quantity_in_stock + $1 WHERE part_number = $2 RETURNING *',
            [quantity_used, part_number]
        );

        const deletePart = await pool.query(
            'DELETE FROM used_parts WHERE job_id = $1 AND part_number = $2 RETURNING *',
            [job_id, part_number]
        );

        await logJobsAction("Delete From Used", req.username, "Part Management", {
            message: `Part ${part_number} removed from used and quantity added back to inventory.`,
            details: updateInventory.rows[0]
        });

        await pool.query('COMMIT');

        res.json({ message: `Part ${part_number} removed from used and quantity added back to inventory.` });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: 'Failed to remove part from used' });
    }
});

router.delete('/:job_id', authorization, async (req, res) => {
    const { job_id } = req.params;

    try {
        await pool.query('BEGIN');

        const fetchJob = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [job_id]);
        if (fetchJob.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: `Job ${job_id} not found` });
        }

        const jobDetails = fetchJob.rows[0];

        const deleteQuery = 'DELETE FROM jobs WHERE job_id = $1';
        const result = await pool.query(deleteQuery, [job_id]);

        await logJobsAction("Delete Job", req.username, "Job Management", {
            message: `Job at address ${jobDetails.address} removed successfully`,
            details: jobDetails
        });

        await pool.query('COMMIT');

        res.status(200).json({ message: `Job ${job_id} removed successfully` });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error removing job:', err);
        res.status(500).json({ error: 'Failed to remove job', detail: err.message });
    }
});

router.put('/:job_id', authorization, async (req, res) => {
    const { job_id } = req.params;
    const { customer_name, address, phone, email } = req.body;

    try {
        await pool.query('BEGIN');

        const fetchCurrentJob = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [job_id]);
        if (fetchCurrentJob.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: `Job ${job_id} not found` });
        }

        const updateQuery = `
            UPDATE jobs
            SET customer_name = $1, address = $2, phone = $3, email = $4
            WHERE job_id = $5
            RETURNING *;`;
        const result = await pool.query(updateQuery, [customer_name, address, phone, email, job_id]);

        await logJobsAction("Update Job", req.username, "Job Management", {
            message: "Update",
            details: result.rows[0]
        });

        await pool.query('COMMIT');

        res.json(result.rows[0]);
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error updating job:', err);
        res.status(500).json({ error: 'Failed to update job', detail: err.message });
    }
});


module.exports = router;
