require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const fs = require('fs');
const https = require('https'); 

const authRoute = require("./routes/jwtAuth");
const dashRoute = require("./routes/dashboard");
  
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['https://localhost'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true // If your frontend needs to send cookies or use credentials
};
app.use(cors(corsOptions));

// app.use(cors());

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

// Load SSL certificate
const options = {
  key: fs.readFileSync('/usr/src/app/ssl/privkey.pem'),
  cert: fs.readFileSync('/usr/src/app/ssl/fullchain.pem')
};

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});


// require('dotenv').config();
// const express = require('express');
// const app = express();
// app.use(express.json());

// const authRoute = require("./routes/jwtAuth");
// const dashRoute = require("./routes/dashboard");
  
// const cors = require('cors');
// app.use(cors());

// app.use("/auth", authRoute);
// app.use("/dashboard", dashRoute);

// // Error handling for if an endpoint is not found
// app.use((req, res, next) => {
//   const error = new Error("Not Found");
//   error.status = 404;
//   next(error);
// });

// // Handles all errors
// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//       error: {
//           message: error.message
//       }
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));