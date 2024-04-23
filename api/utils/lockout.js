const pool = require("../db");
const moment = require("moment-timezone");

async function getUserLockoutStatus(userId) {
    const result = await pool.query("SELECT * FROM login_attempts WHERE user_id = $1", [userId]);
    return result.rows.length ? result.rows[0] : null;
}

async function updateFailedAttempts(userId, reset = false) {
    if (reset) {
        await pool.query("UPDATE login_attempts SET failed_attempts = 0, is_locked_out = FALSE, lockout_until = NULL WHERE user_id = $1", [userId]);
    } 
    else { 
        await pool.query("UPDATE login_attempts SET failed_attempts = failed_attempts + 1 WHERE user_id = $1", [userId]);
    }
}

async function setLockout(userId) {
    const minutes = 30;
    const lockoutUntil = moment().tz("America/Chicago").add(minutes, 'minutes').toDate();
    await pool.query("UPDATE login_attempts SET is_locked_out = TRUE, lockout_until = $2 WHERE user_id = $1", [userId, lockoutUntil]);
}

module.exports = {
    getUserLockoutStatus,
    updateFailedAttempts,
    setLockout
};