const connection = require("../../config/connection");

async function executeQuery(sqlString, image) {
    return await new Promise((resolve, reject) => {
        connection.query(sqlString, [image], (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

async function executeQueryIngredients(sqlString, ingredient, ingredientQty, ingredientUnit) {
    return await new Promise((resolve, reject) => {
        for (let i = 0; i < ingredient.length; i++) {
            connection.query(sqlString, [ingredient[i], ingredientQty[i], ingredientUnit[i]], (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        }
    });
}

module.exports = {executeQuery, executeQueryIngredients};