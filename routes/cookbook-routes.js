const dbConnection = require("../config/connection");
const expressFileUpload = require("express-fileupload");
const dbService = require("../config/db-service");
const auth = require("../helpers/checkAuthenticated");

module.exports = function (app) {

    app.use(expressFileUpload({
        limits: {fileSize: 50 * 1024 * 1024},
    }));

    app.get("/cookbook", auth.checkAuthenticated, (req, res) => {
        dbConnection.queryExecutor(
            "select distinct (type) from recipes;",
            null,
            (err, data) => {
                if (err) throw err;
                res.status(200).render("index", {type: data});
            }
        );
    });

    app.get("/cookbook/:recipeType", auth.checkAuthenticated, (req, res) => {
        dbConnection.queryExecutor(
            `select * from recipes where type="${req.params.recipeType}"`,
            null,
            (err, data) => {
                if (err) throw err;
                res.render("recipes", {recipe: data, type: data[0]});
            }
        );
    });

    app.get("/cookbook/recipes/:recipeId", auth.checkAuthenticated, (req, res) => {
        dbConnection.queryExecutor(
            `select * from recipes where id="${req.params.recipeId}"`,
            null,
            (err, data_route) => {
                if (err) throw err;
                dbConnection.queryExecutor(
                    `select ri.recipe_id, i.name as 'name', ri.measurement_qty as 'amount', mu.name as 'unit' from recipe_ingredients ri join ingredients i on i.id = ri.ingredient_id left outer join measurement_units mu on mu.id = measurement_id where recipe_id = "${data_route[0].id}";`,
                    null,
                    (err, data_ingr) => {
                        if (err) throw err;
                        res.render("recipe-name", {recipe: data_route[0], ingredients: data_ingr});
                    }
                );
            }
        );
    });

    app.get("/images/:imageId", auth.checkAuthenticated, (req, res) => {
        dbConnection.queryExecutor(
            `select * from recipes where id="${req.params.imageId}"`,
            null,
            (err, data) => {
                if (err) throw err;
                res.contentType("image/jpeg");
                let buffer = "";
                if (data[0].image !== null) {
                    buffer = Buffer.from(data[0].image, 'binary');
                }
                res.write(buffer);
                res.end();
            }
        );
    });

    app.get("/add-recipe", auth.checkAuthenticated, (req, res) => {
        res.render("add-recipe");
    });

    app.post("/cookbook", auth.checkAuthenticated, dbService.createRecipe);

}
