const router = require("express").Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
const { getUserLockoutStatus, updateFailedAttempts, setLockout} = require("../utils/lockout");
const moment = require("moment-timezone");

async function logAddUserAction(actionType, userId, logType, changeDetails) {
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

router.get("/check-initial-setup", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT setting_value FROM app_settings WHERE setting_key = 'first_registration_completed'");
        const isSetupCompleted = rows[0] ? rows[0].setting_value : false;
        res.json({ initialSetupComplete: isSetupCompleted });
    } catch (err) {
        console.error('Error checking initial setup status:', err.message);
        res.status(500).send("Server Error");
    }
});

router.post("/firstregister", validInfo, async(req, res) => {
    const client = await pool.connect();
    try {
        // Check if the first registration has already been completed
        const { rows } = await client.query("SELECT setting_value FROM app_settings WHERE setting_key = 'first_registration_completed'");
        if (rows[0].setting_value) {
            return;  // If the registration has already been completed, exit silently
        }

        const { username, password, email, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await client.query(
            "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
            [username, hashedPassword, email]
        );

        await client.query("INSERT INTO roles (role_name) VALUES ($1) ON CONFLICT (role_name) DO NOTHING;", [role]);
        
        const getRole = "SELECT * FROM roles WHERE role_name = $1;";
        const resultsGetRole = await client.query(getRole, [role]);
        if (resultsGetRole.rows.length > 0) {
            const roleId = resultsGetRole.rows[0].role_id;
            await client.query(
                "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT (user_id, role_id) DO NOTHING;",
                [newUser.rows[0].user_id, roleId]
            );
        }

        await client.query(
            "INSERT INTO login_attempts (user_id, failed_attempts, is_locked_out, lockout_until) VALUES ($1, 0, FALSE, NULL)",
            [newUser.rows[0].user_id]
        );
        await client.query(
            "UPDATE app_settings SET setting_value = TRUE WHERE setting_key = 'first_registration_completed'"
        );

        res.json({ message: "Initial user was successfully registered!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    } finally {
        client.release();
    }
});

router.post("/register", validInfo, authorization, async(req, res) => {
    const client = await pool.connect();
    try {
        const {username, password, email, role} = req.body;

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists"); //401 means that the user is Unauthenticated
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
        const newUser = await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *", [username, hashedPassword, email]);

        await pool.query(
            "INSERT INTO roles (role_name) VALUES ($1) ON CONFLICT (role_name) DO NOTHING;", [role],
        );
        
        const getRole = "SELECT * FROM roles WHERE role_name = $1;";
        const resultsGetRole = await client.query(getRole, [role]);
        const roleId = resultsGetRole.rows[0].role_id;
        if (resultsGetRole.rows.length > 0) {
            // Now use this roleId to insert into user_roles
            await pool.query(
                "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT (user_id, role_id) DO NOTHING;",
                [newUser.rows[0].user_id, roleId] // newUser.rows[0].user_id should be the user's ID, roleId is the role_id
            );
        } else {
            console.error("Role not found or failed to insert.");
        }

        await pool.query("INSERT INTO login_attempts (user_id, failed_attempts, is_locked_out, lockout_until) VALUES ($1, 0, FALSE, NULL)", [newUser.rows[0].user_id])

        const roleCheck = await pool.query("SELECT role_id FROM roles WHERE role_name = $1", [role]);
        if (roleCheck.rows.length === 0) {
            return res.status(400).json("Role does not exist"); // Or handle default role assignment
        }

        await logAddUserAction('Added User', req.username, 'Add User', { 
            message: 'Added User to Application Whitelist', 
            details: { 
                username: username,
                email: email,
                role: role
            } 
        });

        res.json("User was successfully registered!");

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.post("/login", validInfo, async (req, res) => {
    try {
        //1. destructure the req.body

        const {username, password} = req.body;

        //2. check if user doesn't exist (if not then we throw error)

        const userQuery = `
            SELECT users.user_id, users.password, roles.role_name
            FROM users
            JOIN user_roles ON users.user_id = user_roles.user_id
            JOIN roles ON user_roles.role_id = roles.role_id
            WHERE username = $1
        `;
        const user = await pool.query(userQuery, [username]);

        if (user.rows.length === 0) {
            return res.status(401).json("Username or Password is incorrect");
        }

        //3. Check the lockout status of the user

        const userId = user.rows[0].user_id;
        const lockoutStatus = await getUserLockoutStatus(userId);   
        
        const lockoutUntilCST = moment.tz(lockoutStatus.lockout_until, "America/Chicago");
        const nowCST = moment().tz("America/Chicago");

        
        if (lockoutStatus && lockoutStatus.is_locked_out && lockoutUntilCST > nowCST) {
            return res.status(403).json("Account locked. Try again later.");
        }

        if(lockoutStatus.failed_attempts > 4) { //If there have been at 5 attempts but the lockout time has expired then reset the user
            updateFailedAttempts(userId, true);
        }

        //4. check if incomming password is the same as the database password and update the attempts of invalid password attempts if needed

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {

            if(lockoutStatus.failed_attempts === 4) { //There must have been 4 prior attempts to enter the password, so this would be the 5th attempt. Hence, the user's account will be locked out.
                setLockout(userId);
            }

            updateFailedAttempts(userId);
            return res.status(401).json("Username or Password is incorrect");
        }

        await updateFailedAttempts(userId, true); //Reset the failed attempts since the user entered the correct password

        const role = user.rows[0].role_name;
        //5. give them the jwt token
        const token = jwtGenerator(user.rows[0].user_id, username, role);


        res.json({token});
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get("/verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;