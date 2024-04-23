const router = require("express").Router();
const pool = require('../db'); 
const authorization = require("../middleware/authorization"); 
const jwtGenerator = require("../utils/jwtGenerator");


router.get('/', authorization, async (req, res) => {
    try {
        const allUsersQuery = `
            SELECT 
                u.user_id,  
                u.username, 
                r.role_name 
            FROM 
                user_roles ur 
                JOIN users u ON ur.user_id = u.user_id 
                JOIN roles r ON ur.role_id = r.role_id;
        `;
    
        const result = await pool.query(allUsersQuery);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.post('/updateRole', authorization, async (req, res) => {
    const { user_id, role } = req.body;

    try {
        const roleQuery = 'SELECT role_id, role_name FROM roles WHERE role_name = $1';
        const roleRes = await pool.query(roleQuery, [role]);
        
        if (roleRes.rows.length === 0) {
            console.log("Role not found in the database:", role);
            return res.status(404).send('Role not found');
        }
        const role_id = roleRes.rows[0].role_id;
        const newRoleName = roleRes.rows[0].role_name;

        const updateQuery = 'UPDATE user_roles SET role_id = $1 WHERE user_id = $2 RETURNING user_id';
        const updateRes = await pool.query(updateQuery, [role_id, user_id]);

        if (updateRes.rowCount === 0) {
            return res.status(404).send('User not found or role not changed');
        }
        
        const newToken = jwtGenerator(user_id, req.user.username, newRoleName); 
        
        res.json({ message: 'User role updated successfully', token: newToken });
    } catch (err) {
        console.error("Error updating user role:", err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/remove', authorization, async (req, res) => {
    const { user_id } = req.body;
    try {
        const deleteQuery = 'DELETE FROM users WHERE user_id = $1';
        const deleteRes = await pool.query(deleteQuery, [user_id]);

        if (deleteRes.rowCount === 0) {
            return res.status(404).send('User not found');
        }
        
        res.send('User removed successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
