require('dotenv').config();
const path = require('path'); // Add this line to import the path module
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Adjust path as necessary
const app = express();
app.use(express.json());


app.use(express.static(path.join(__dirname, '..', 'FrontEnd', 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'FrontEnd', 'public', 'login.html'));
  });
  
const cors = require('cors');
app.use(cors());

app.post('/register', async (req, res) => {
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
app.post('/login', async (req, res) => {
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
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

