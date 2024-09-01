const mysql = require("mysql2/promise");
const hashSaltRounds = 14;

console.log("[Database]> Connecting to database.");
console.log("[Database]> ...");

const SQLDB = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'University'
});

console.log("[Database]> Connection established.");
console.log("[Database]> running ...");

module.exports = { SQLDB, hashSaltRounds }