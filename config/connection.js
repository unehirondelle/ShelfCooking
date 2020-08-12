const mysql = require("mysql");
require('dotenv').config();

let connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.createPool(process.env.JAWSDB_URL);
} else {
    connection = mysql.createPool({
        connectionLimit: 10,
        host: "localhost",
        port: 3306,
        user: "root",
        password: process.env.DB_PASSWORD,
        database: "recipes_db"
    });
}

connection.getConnection((err, connection) => {
    if (err) {
        console.error(`error connecting: ${err.stack}`);
        return;
    }
    if (connection) {
        console.log(`connection as id ${connection.threadId}`);
        connection.release();
    }
});



module.exports = connection;