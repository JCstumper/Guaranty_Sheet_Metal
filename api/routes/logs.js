const express = require('express');
const router = express.Router();
const pool = require('../db'); // make sure the path to db.js is correct
const authorization = require("../middleware/authorization");

router.get('/', authorization, async (req, res) => {
    try {
        const logs = await pool.query(`
        SELECT * FROM log
        `);
        res.json({logs});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
