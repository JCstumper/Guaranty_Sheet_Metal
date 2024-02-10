const Pool = require("pg").Pool;

const pool = new Pool({
    user: "admin",
    password: "Guaranty123",
    database: "GuarantyDatabase",
    host: "localhost",
    port: 5432
});

module.exports = pool;