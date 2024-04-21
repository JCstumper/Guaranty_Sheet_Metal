const router = require("express").Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
const { logInventoryAction } = require("./products");
const jwtGenerator = require("../utils/jwtGenerator");

router.post("/profile", authorization, validInfo, async(req, res) => {
    try {
        const { newUsername, newPassword, newEmail } = req.body;
        const userId = req.user; 

        let updates = [];
        let values = [];
        let queryIndex = 1;

        // Building the details object for logging
        let logDetails = {
            newUsername: newUsername || "blank",
            newPassword: newPassword ? "****" : "blank",  // Masked for security
            newEmail: newEmail || "blank"
        };
        
        if (newUsername) {

            //2. check if user exist (if user exist throw error)

            // const user = await pool.query("SELECT * FROM users WHERE username = $1", [newUsername]);

            // if (user.rows.length !== 0) {
            //     return res.status(401).json("User already exists"); //401 means that the user is Unauthenticated
            // }

            updates.push(`username = $${queryIndex}`);
            values.push(newUsername);
            queryIndex++;
        }
        
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updates.push(`password = $${queryIndex}`);
            values.push(hashedPassword);
            queryIndex++;
        }
        
        if (newEmail) {
            updates.push(`email = $${queryIndex}`);
            values.push(newEmail);
            queryIndex++;
        }

        values.push(userId); // The user's ID must be the last value for the WHERE clause

        if (updates.length > 0) {
            const updateQuery = `
                UPDATE users 
                SET ${updates.join(", ")} 
                WHERE user_id = $${queryIndex}
                RETURNING *;
            `;

            const updatedUser = await pool.query(updateQuery, values);

            // Check if the update was successful
            if (updatedUser.rows.length > 0) {
                
                // Decide the username for logging
                const usernameForLogging = newUsername ? newUsername : req.username;

                // Log the update action
                await logInventoryAction('Update Profile', req.username, 'User Profile', {
                    message: 'Profile updated successfully',
                    details: logDetails
                });

                if(usernameForLogging !== req.username) {
                    const newToken = jwtGenerator(userId, usernameForLogging, req.role);
                    res.json({ message: "User updated successfully", user: updatedUser.rows[0], token: newToken });
                }
                else {
                    res.json({ message: "User updated successfully", user: updatedUser.rows[0] });
                }
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } 
        else {
            res.status(400).json({ message: "No fields to update" });
        }

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;