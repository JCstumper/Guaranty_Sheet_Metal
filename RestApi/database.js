const Pool = require("pg").Pool;
/*
const pool = new Pool({
    user: "admin",
    password: "Guaranty123",
    database: "GuarantyDatabase",
    host: "localhost",
    port: 5432
});
*/
const pool = new Pool({
    user: "admin",
    password: "Guaranty123",
    database: "GuarantyDatabase",
    host: "ec2-54-89-101-102.compute-1.amazonaws.com",
    port: 5432
});
module.exports = pool;