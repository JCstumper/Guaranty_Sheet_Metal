const Pool = require("pg").Pool;

const pool = new Pool({
    user: "admin",
    password: "Guaranty123",
    database: "GuarantyDatabase",
    host: "ec2-13-58-27-57.us-east-2.compute.amazonaws.com",
    port: 5432
});

module.exports = pool;