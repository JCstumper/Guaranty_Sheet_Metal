// middleware/verifyRoles.js

const pool = require('../db'); // Assuming your pool is exported from db.js

const verifyRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Assuming req.user contains the authenticated user's details
            const userId = req.user.id; // Adjust based on how you store this information

            // Query the database for the user's roles
            const userRolesQuery = `
                SELECT r.role_name FROM roles r
                JOIN user_roles ur ON r.role_id = ur.role_id
                WHERE ur.user_id = $1;
            `;

            const { rows } = await pool.query(userRolesQuery, [userId]);
            const roles = rows.map(row => row.role_name);

            // Check if the user has one of the required roles
            const hasRole = roles.some(role => allowedRoles.includes(role));
            if (!hasRole) {
                return res.status(403).json({ message: "You don't have permission to access this resource." });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    };
};

module.exports = verifyRoles;
