module.exports = (req, res, next) => {
    const { username, password, email } = req.body;
    
    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    function validUsername(userName) {
        return /^[A-Za-z][A-Za-z0-9_]{4,29}$/.test(username);
    }
  
    if (req.path === "/register") {
        console.log(!email.length);
        if (![username, password, email].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
        else if(!validUsername(username)) {
            return res.status(401).json("Invalid Username.\n Username must begin with an alphabetical character, it can contain a lowercase or uppercase character, digit, or underscore, and it must be between 5-29 characters long.");
        }
    } 
    else if (req.path === "/login") {
        if (![username, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } 
        else if(!validUsername(username)) {
            return res.status(401).json("Invalid Username.\n Username must begin with an alphabetical character, it can contain a lowercase or uppercase character, digit, or underscore, and it must be between 5-29 characters long.");
        }
    }
    
    next();
};