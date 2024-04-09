const router = require("express").Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
const { getUserLockoutStatus, updateFailedAttempts, setLockout} = require("../utils/lockout");
const moment = require("moment-timezone");

router.post("/register", validInfo, async(req, res) => {
    try {
        //1. destructure the req.body (name, email, password)
        const { username, password, email } = req.body; // Removed role from req.body

        //2. check if user exists (if user exists throw error)
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists");
        }

        //3. Bcrypt the user password
        const hashedPassword = await bcrypt.hash(password, 10);

        //4. enter the new user inside our database
        const newUser = await pool.query(
            "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *", 
            [username, hashedPassword, email]
        );

        // Assign the default role (employee) to the new user
        // Fetch the role_id for 'employee'
        const defaultRole = 'admin'; // Hardcoded default role
        const roleRes = await pool.query("SELECT role_id FROM roles WHERE role_name = $1", [defaultRole]);
        
        // It's a good idea to ensure that the 'employee' role definitely exists in your roles table
        if (roleRes.rows.length === 0) {
            return res.status(400).json("Default role does not exist. Please initialize your database with default roles.");
        }
        const employeeRoleId = roleRes.rows[0].role_id;

        // Assign 'employee' role to the new user
        await pool.query(
            "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)", 
            [newUser.rows[0].user_id, employeeRoleId]
        );

        //5. Update the login_attempts table with the new user's user_id
        await pool.query(
            "INSERT INTO login_attempts (user_id, failed_attempts, is_locked_out, lockout_until) VALUES ($1, 0, FALSE, NULL)", 
            [newUser.rows[0].user_id]
        );

        const roles = ['employee']; // Default role assigned to all new registrations
        //6. generating our jwt token
        const token = jwtGenerator(newUser.rows[0].user_id, newUser.rows[0].username);

        res.json({ token, roles });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.post("/login", validInfo, async (req, res) => {
    try {
        //1. destructure the req.body

        const {username, password} = req.body;

        //2. check if user doesn't exist (if not then we throw error)

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            return res.status(401).json("Username or Password is incorrect");
        }

        //3. Check the lockout status of the user

        const userId = user.rows[0].user_id;
        const lockoutStatus = await getUserLockoutStatus(userId);   
        
        const lockoutUntilCST = moment.tz(lockoutStatus.lockout_until, "America/Chicago");
        const nowCST = moment().tz("America/Chicago");

        // console.log(lockoutUntilCST.format());
        // console.log(nowCST.format());
        
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

        // Query the database for the user's roles
            const userRolesQuery = `
            SELECT r.role_name FROM roles r
            JOIN user_roles ur ON r.role_id = ur.role_id
            WHERE ur.user_id = $1;
            `;
            const userRolesResult = await pool.query(userRolesQuery, [user.rows[0].user_id]);
            const roles = userRolesResult.rows.map(row => row.role_name);

        //5. give them the jwt token
        const token = jwtGenerator(user.rows[0].user_id, user.rows[0].username);


        res.json({token,roles});
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