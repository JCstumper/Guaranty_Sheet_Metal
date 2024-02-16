require('dotenv').config();
const path = require('path'); // Add this line to import the path module
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Adjust path as necessary
const app = express();
app.use(express.json());

const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");


app.use(express.static(path.join(__dirname, '..', 'FrontEnd', 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'FrontEnd', 'public', 'login.html'));
  });
  
const cors = require('cors');
app.use(cors());

// Routes to handle requests
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);

// Error handling for if an endpoint is not found
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Handles all errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
      error: {
          message: error.message
      }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

