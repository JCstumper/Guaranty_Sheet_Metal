module.exports = (req, res, next) => {
    const { username, password, email } = req.body;
    
    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    function validUsername(userName) {
        // return /^[A-Za-z][A-Za-z0-9_]{4,29}$/.test(username);
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-+=])[A-Za-z\d!@#$%^&*()-+=_]{7,29}$/.test(userName);
    }
  
    if (req.path === "/register") {
        console.log(!email.length);
        if (![username, password, email].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
        else if(!validUsername(username)) {
            return res.status(401).json("Invalid Username. Username must contain at least 1 uppercase character, 1 digit, 1 special character, and it must be between 8-29 characters long.");
        }
    } 
    else if (req.path === "/login") {
        if (![username, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } 
        else if(!validUsername(username)) {
            return res.status(401).json("Invalid Username. Username must contain at least 1 uppercase character, 1 digit, 1 special character, and it must be between 8-29 characters long.");
        }
    }
    
    next();
};