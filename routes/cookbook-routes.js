const connection = require("../config/connection");
const expressFileUpload = require("express-fileupload");
const dbService = require("../config/db-service");

module.exports = function (app) {

    app.use(expressFileUpload({
        limits: {fileSize: 50 * 1024 * 1024},
    }));

    app.get("/cookbook", (req, res) => {
        const sql_rec = "select distinct (type) from recipes;"
        connection.query(sql_rec, (err, data) => {
            if (err) throw err;
            res.render("index", {type: data});
        });
    });

    app.get("/cookbook/:recipeType", (req, res) => {
        const sql_rec = `select * from recipes where type="${req.params.recipeType}"`;
        connection.query(sql_rec, (err, data) => {
            if (err) throw err;
            res.render("recipes", {recipe: data, type: data[0]});
        });
    });

    app.get("/cookbook/recipes/:recipeId", (req, res) => {
        const sql_route = `select * from recipes where id="${req.params.recipeId}"`;
        connection.query(sql_route, (err, data_route) => {
            if (err) throw err;
            const sql_ingr = `select ri.recipe_id, i.name as 'name', ri.measurement_qty as 'amount', mu.name as 'unit' from recipe_ingredients ri join ingredients i on i.id = ri.ingredient_id left outer join measurement_units mu on mu.id = measurement_id where recipe_id = "${data_route[0].id}";`
            connection.query(sql_ingr, (err, data_ingr) => {
                if (err) throw err;
                res.render("recipe-name", {recipe: data_route[0], ingredients: data_ingr});
            });
        });
    });

    app.get("/images/:imageId", (req, res) => {
        const sql = `select * from recipes where id="${req.params.imageId}"`;
        connection.query(sql, (err, data) => {
            if (err) throw err;
            res.contentType("image/jpeg");
            let buffer = "";
            if (data[0].image !== null) {
                buffer = Buffer.from(data[0].image, 'binary');
            }
            res.write(buffer);
            res.end()
        });
    });

    app.get("/add-recipe", (req, res) => {
        res.render("add-recipe");
    });

    app.post("/cookbook", dbService.createRecipe);

    /*app.post("/cookbook", (req, res) => {
        const sql_recipe = "insert into recipes (name, method, time, person_num, type, image, utensils) values (?, ?, ?, ?, ?, ?, ?)";
        connection.query(sql_recipe, [req.body.recipeName, req.body.method, req.body.recipeTime, req.body.portions, req.body.recipeCategory, req.files.recipeImage.data, req.body.utensils], (err, data) => {
            if (err) throw err;
            console.log(data.insertId);
            for (let i = 0; i < req.body.ingredient.length; i++) {
                const sql_ingr = `insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id) values ("${data.insertId}", ?, ?, ?)`;
                connection.query(sql_ingr, [req.body.ingredient[i], req.body.ingredientQty[i], req.body.ingredientUnit[i]], (err, data_ingr) => {
                    if (err) throw err;
                });
            }
        });
        res.redirect("/cookbook");
    });*/

}
