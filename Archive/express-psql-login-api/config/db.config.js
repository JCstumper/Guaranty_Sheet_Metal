// PostgeSQL and Sequelize related

module.exports = {
    HOST: "localhost",
    USER: "admin",
    PASSWORD: "Guaranty123",
    DATABASE: "GuarantyDatabase",
    dialect: "postgres", //Tell Sequelize that we are using PostgreSQL
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};