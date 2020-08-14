const mySql = require("../helpers/mysql/executeQuery");
const sql = require("../helpers/mysql/sqlQuery-cookbook");
const eh = require("../helpers/eh");

async function createRecipe(req, res) {
    const {recipeName, method, recipeTime, portions, recipeCategory, utensils, ingredient, ingredientQty, ingredientUnit} = req.body;
    let insertId;
    // const {data} = req.files.recipeImage;
    let image;
    if (req.files === null) {
        image = null;
    } else {
        image = req.files.recipeImage.data;
    }

    let message = "";

    try {
        if (recipeName) {
            // insert the new recipe into the db
            let sqlQuery = sql.insertRecipe(recipeName, method, recipeTime, portions, recipeCategory, utensils);

            if (ingredient === null) {
                await mySql.executeQuery(sqlQuery, image);
            } else {
                let recipeResponse = await mySql.executeQuery(sqlQuery, image);
                insertId = recipeResponse.insertId;

                sqlQuery = sql.insertIngredients(insertId);
                await mySql.executeQueryIngredients(sqlQuery, ingredient, ingredientQty, ingredientUnit);

            }


            // get the 'recipe_id' for the newly create recipe
            sqlQuery = sql.selectRecipeIdByName(recipeName);
            const dbResult = await mySql.executeQuery(sqlQuery);
            const {recipeId} = dbResult[0];

            message = {message: "Success!! Your new recipe has been saved to the Database."}
        } else {
            message = {message: "The name value is blank. Please enter a unique name."}
        }

        res.send(message);
        res.redirect("/cookbook");
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).send({
                message: "You have entered a duplicate name!"
            });
        } else {
            const response = eh.errorsHandler(error);
            res.status(response.statusCode).send(response.body);
        }
    }
}

function alertFun() {
    console.log("Hello");
}

module.exports = {createRecipe, alertFun};
