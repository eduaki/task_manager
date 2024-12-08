const mysql = require("mysql2");
require("dotenv").config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const connection = mysql.createPool({
	host,
	user,
	password,
	database,
});

module.exports = connection;
