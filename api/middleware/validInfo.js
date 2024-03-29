module.exports = (req, res, next) => {
    const { username, password, email } = req.body;
    
    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    function validUsername(userName) {
        return /^[A-Za-z][A-Za-z0-9_]{4,29}$/.test(userName);
    }

    function validPassword(userPassword) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-+=])[A-Za-z\d!@#$%^&*()-+=_]{7,29}$/.test(userPassword);
    }

    if (req.path === "/register") {
        // console.log(!email.length);
        if (![username, password, email].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        }
        else if(!validUsername(username)) {
            return res.status(401).json("Invalid Username. Username must be between 5-29 characters long.");
        }
        else if(!validPassword(password)) {
            return res.status(401).json("Invalid Password. Password must contain at least 1 capital letter, 1 digit, 1 special character, and must be between 8-29 characters long.")
        } 
        else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    } 
    else if (req.path === "/login") {
        if (![username, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } 
    }
    else if (req.path === "/profile") {
        const { newUsername, newPassword, newEmail } = req.body;
        
        if (newUsername && !validUsername(newUsername)) {
            return res.status(401).json("Invalid Username. Username must be between 5-29 characters long.");
        }
        else if(newPassword && !validPassword(newPassword)) {
            return res.status(401).json("Invalid Password. Password must contain at least 1 capital letter, 1 digit, 1 special character, and must be between 8-29 characters long.")
        } 
        else if (newEmail && !validEmail(newEmail)) {
            return res.status(401).json("Invalid Email");
        }
    }
    
    next();
};