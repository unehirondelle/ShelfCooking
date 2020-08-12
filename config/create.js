const mySql = require("./executeQuery");
const sql = require("../test/sqlQuery-cookbook");
const eh = require("../test/eh");

async function createRecipe(req, res) {
    const {recipeName, method, recipeTime, portions, recipeCategory, utensils} = req.body;
    // const {data} = req.files.recipeImage;
    const image = req.files.recipeImage.data;
    let message = "";

    try {
        if (recipeName) {
            // insert the new recipe into the db
            let sqlQuery = sql.insertRecipe(recipeName, method, recipeTime, portions, recipeCategory, utensils);
            await mySql.executeQuery(sqlQuery, image);

            // get the 'recipe_id' for the newly create recipe
            sqlQuery = sql.selectRecipeIdByName(recipeName);
            const dbResult = await mySql.executeQuery(sqlQuery);
            const {recipeId} = dbResult[0];

            message = {message: "Success!! Your new recipe has been saved to the Database."}
        } else {
            message = {message: "The name value is blank. Please enter a unique name."}
        }

        // res.send(message);
        res.redirect("/cookbook");
    } catch (error) {
        if (error.code == 'ER_DUP_ENTRY') {
            res.status(400).send({
                message: "You have entered a duplicate name!"
            });
        } else {
            const response = eh.errorsHandler(error);
            res.status(response.statusCode).send(response.body);
        }
    }
}

module.exports = createRecipe;