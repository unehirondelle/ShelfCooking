const connection = require("./connection");

async function executeQuery(sqlString, image) {
    return await new Promise(function (resolve, reject) {
        connection.query(sqlString, [image], function (error, results) {
            if (error) {
                reject(error);
            }
            resolve(results)
        });
    });
}

module.exports = {executeQuery};