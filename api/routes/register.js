const express = require("express");
const bcrypt = require('bcrypt');
const pool = require('../db');
const app = express();

app.post("/", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
  
      const newUser = await pool.query(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
        [username, hashedPassword, email]
      );
  
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
});

module.exports = app;