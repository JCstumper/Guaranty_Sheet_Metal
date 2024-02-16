const express = require("express");
const app = express();
const morgan = require("morgan"); // morgan is a login package that logs incoming requests
const bodyParser = require("body-parser");

const usersRoutes = require("./api/routes/users");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Prevent CORS Errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested_width, Content-Type, Accept, Authorization");
    
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes to handle requests
app.use("/users", usersRoutes);

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

module.exports = app;