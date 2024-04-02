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
  



module.exports = router;
