const mysql = require("mysql");
require('dotenv').config();

let pool;
let config;

if (process.env.JAWSDB_URL) {
    config = process.env.JAWSDB_URL;
} else {
    config = {
        connectionLimit: 10,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
        host: "localhost",
        port: 3306,
        user: "root",
        password: process.env.DB_PASSWORD,
        database: "recipes_db"
    }

}

pool = mysql.createPool(config);
const sessionConnection = mysql.createConnection(config);

function queryExecutor(query, values, cb) {

    pool.getConnection((err, connection) => {
        if (err) throw err;

        console.log(`connection as id ${connection.threadId}`);
        connection.query(query, values, (err, data) => {
            connection.release();
            if (!err) {
                cb(null, data);
            }
        });
    });
}

const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log('failed to open connection', err);
                return reject(err);
            }
            console.log('in Promise', connection);
            resolve(connection);
        });
    });
};

const getConnectionWrapper = async () => {
    const connection = await getConnection();
    console.log('in wrapper', connection);
};

module.exports = {pool, queryExecutor: queryExecutor, sessionConnection};