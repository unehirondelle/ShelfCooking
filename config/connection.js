const mysql = require("mysql");
require('dotenv').config();

let pool;

if (process.env.JAWSDB_URL) {
    pool = mysql.createPool(process.env.JAWSDB_URL);
} else {
    pool = mysql.createPool({
        connectionLimit: 10,
        host: "localhost",
        port: 3306,
        user: "root",
        password: process.env.DB_PASSWORD,
        database: "recipes_db"
    });
}


function queryExecutor(query, values, cb) {

    pool.getConnection((err, connection) => {
        if (err) {
            throw err;
        }
        console.log(`connection as id ${connection.threadId}`);
        connection.query(query, values, (err, data) => {
            connection.release();
            if (!err) {
                cb(null, data);
            }
        });
    });
}


module.exports = {pool, queryExecutor: queryExecutor};