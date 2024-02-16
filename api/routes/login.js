const express = require("express");
const bcrypt = require('bcrypt');
const pool = require('../db');
const app = express();

app.post("/", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
      if (user.rows.length > 0) {
        // User found
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
  
        if (isValidPassword) {
          res.json({ message: "Login successful" });
        } else {
          res.status(400).json({ message: "Invalid Password" });
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});

module.exports = app;