const router = require("express").Router();
const pool = require("../db.js");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT username FROM users WHERE user_id = $1", [req.user]);
    
        res.json(
            user.rows[0]
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

router.get("/counts", authorization, async (req, res) => {
    try {
        const jobsCount = await pool.query("SELECT COUNT(*) as count FROM jobs");
        const productCount = await pool.query("SELECT COUNT(*) as count FROM products");
        const invoiceCount = await pool.query("SELECT COUNT(*) as count FROM invoices");
        
        res.json({
            customers: jobsCount.rows[0].count,
            products: productCount.rows[0].count,
            purchases: invoiceCount.rows[0].count
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

module.exports = router;