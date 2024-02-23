require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const authRoute = require("./routes/jwtAuth");
const dashRoute = require("./routes/dashboard");
  
const cors = require('cors');
app.use(cors());

app.use("/auth", authRoute);
app.use("/dashboard", dashRoute);

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

