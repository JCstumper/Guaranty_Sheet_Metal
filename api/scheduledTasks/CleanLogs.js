const cron = require('node-cron');
const pool = require('../db'); // Adjust the path to your actual pool configuration

// Schedule a task to run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('Running a daily task to clean up old inventory logs');
    try {
        const res = await pool.query(`
            DELETE FROM inventory_log 
            WHERE action_timestamp < NOW() - INTERVAL '1 month'
        `);
        console.log(`Deleted ${res.rowCount} old inventory log records.`);
    } catch (err) {
        console.error('Error cleaning up old inventory logs:', err);
    }
});
