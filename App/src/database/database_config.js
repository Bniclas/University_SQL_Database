const mysql = require("mysql2/promise");
const hashSaltRounds = 14;

console.log("[Database]> Connecting to database.");
console.log("[Database]> ...");

const SQLDB = mysql.createPool({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PW,
	database: process.env.DATABASE_DB
});

console.log("[Database]> Connection established.");
console.log("[Database]> running ...");

module.exports = { SQLDB, hashSaltRounds }