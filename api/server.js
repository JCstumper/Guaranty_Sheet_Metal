require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const authRoute = require("./routes/jwtAuth");
const dashRoute = require("./routes/dashboard");
const productsRoute = require('./routes/products');
  
const cors = require('cors');
app.use(cors());

app.use("/auth", authRoute);
app.use("/dashboard", dashRoute);
app.use("/products", productsRoute);

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

