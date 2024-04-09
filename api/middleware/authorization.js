const jwt = require("jsonwebtoken");
const pool = require('../db'); // Make sure this path is correct to import your database connection
require("dotenv").config();

module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.status(403).json("Not Authorized");
        }

        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        // Assuming payload.user contains the user's ID
        req.user = payload.user;

        // New: Query the database for the user's roles
        const userRolesQuery = `
            SELECT r.role_name FROM roles r
            JOIN user_roles ur ON r.role_id = ur.role_id
            WHERE ur.user_id = $1;
        `;
        const { rows } = await pool.query(userRolesQuery, [req.user.id]); // Make sure to match the ID field as per your JWT payload structure
        const roles = rows.map(row => row.role_name);

        // Attach roles to the req.user object
        req.user.roles = roles;

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorized");
    }
};
