const pool = require("../db");
const moment = require("moment-timezone");

async function getUserLockoutStatus(userId) {
    
    //Grab the user's user_id, failed_attempts, is_locked_out, and locked_until information
    const result = await pool.query("SELECT * FROM login_attempts WHERE user_id = $1", [userId]);
    
    //Check if the user was found. If the user is present, return the information in the row. Otherwise, return null.
    return result.rows.length ? result.rows[0] : null;
}

async function updateFailedAttempts(userId, reset = false) {
    
    //If the user entered the correct password, reset the failed_attempts, is_locked_out, and lockout_until
    if (reset) {
        await pool.query("UPDATE login_attempts SET failed_attempts = 0, is_locked_out = FALSE, lockout_until = NULL WHERE user_id = $1", [userId]);
    } 
    else { //Else update the number of failed attempts
        await pool.query("UPDATE login_attempts SET failed_attempts = failed_attempts + 1 WHERE user_id = $1", [userId]);
    }
}

async function setLockout(userId) {
    //The amount of time to keep the user locked out
    const minutes = 30;

    //How long to keep the user locked out. Based on current time + minutes variables
    const lockoutUntil = moment().tz("America/Chicago").add(minutes, 'minutes').toDate();
    
    //Update the table to lock out the user
    await pool.query("UPDATE login_attempts SET is_locked_out = TRUE, lockout_until = $2 WHERE user_id = $1", [userId, lockoutUntil]);
}

module.exports = {
    getUserLockoutStatus,
    updateFailedAttempts,
    setLockout
};