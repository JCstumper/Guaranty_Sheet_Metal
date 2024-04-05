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

        const {username, password, email} = req.body;

        //2. check if user exist (if user exist throw error)

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists"); //401 means that the user is Unauthenticated
        }

        //3. Bcrypt the user password

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10

        //4. enter the new user inside our database

        const newUser = await pool.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *", [username, hashedPassword, email]);

        //5. Update the login_attempts table with the new user's user_id

        await pool.query("INSERT INTO login_attempts (user_id, failed_attempts, is_locked_out, lockout_until) VALUES ($1, 0, FALSE, NULL)", [newUser.rows[0].user_id])

        //6. generating our jwt token
        
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({token});

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

        //5. give them the jwt token

        const token = jwtGenerator(user.rows[0].user_id);

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