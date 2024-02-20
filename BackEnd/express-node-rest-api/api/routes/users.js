const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        meesage: "Handling GET requests to /users"
    });
});

router.post("/", (req, res, next) => {
    const user = {
        userName: req.body.userName,
        password: req.body.password
    };

    res.status(201).json({  // Status Code 201 represents everything was successful and resource was created
        meesage: "Handling POST requests to /users",
        createdUser: user
    });
});

router.get("/:userID", (req, res, next) => {
    const id = req.params.userID;
    if (id === "special") {
        res.status(200).json({
            meesage: "You discovered the special ID",
            id: id
        });
    }
    else {
        res.status(200).json({
            message: "You passed an ID"
        });
    }
});

router.patch("/:userID", (req, res, next) => {
    res.status(200).json({
        meesage: "Updated users!",
    });
});

router.delete("/:userID", (req, res, next) => {
    res.status(200).json({
        meesage: "Deleted users",
    });
});


module.exports = router;