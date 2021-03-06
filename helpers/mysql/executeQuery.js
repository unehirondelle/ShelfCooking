const dbConnection = require("../../config/connection");


async function executeQuery(sqlString, image, user_id) {
    return await new Promise((resolve, reject) => {
        dbConnection.queryExecutor(sqlString,
            [image, user_id],
            (err, res) => {
                if (err) reject(err);
                resolve(res);
            }
        );
    });
}

async function executeQueryIngredients(sqlString, ingredient, ingredientQty, ingredientUnit) {
    return await new Promise((resolve, reject) => {
            for (let i = 0; i < ingredient.length; i++) {
                dbConnection.queryExecutor(
                    sqlString,
                    [ingredient[i], ingredientQty[i], ingredientUnit[i]],
                    (err, res) => {
                        if (err) reject(err);
                        resolve(res);
                    }
                );
            }
        }
    );
}

module.exports = {executeQuery, executeQueryIngredients};