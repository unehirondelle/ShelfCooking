const express = require("express");
const exprhnlbs = require("express-handlebars");
const mysql = require("mysql");
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3010;

app.use(express.static(__dirname + "/public"));

//middleware to transform the request so the data that was sent on req.body could be read
app.use(express.urlencoded({extended: true}));

//parses incoming requests with JSON payloads and is based on body-parser
//returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());

//firstArg: tells Express that the template engine will be responsible for all files with the handlebars extension
//secondArg: directs the templating engine to defaultLayout; handlebars will look inside of our layouts directory
app.engine("handlebars", exprhnlbs({defaultLayout: "main"}));

//firstArg: lets express know the view engine is set
//secondArg: sets the view engine as a handlebars
app.set("view engine", "handlebars");
let connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL)
} else {
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "une_hirondelle",
        password: process.env.DB_PASSWORD,
        database: "recipes_db"
    });
}

connection.connect((err) => {
    if (err) {
        console.error(`error connecting: ${err.stack}`);
        return;
    }
    console.log(`connection as id ${connection.threadId}`);
});

app.get("/", (req, res) => {
    const sql_rec = "select * from recipes;"
    connection.query(sql_rec, (err, data) => {
        if (err) throw err;
        console.log("Recipes:", data);
        res.render("recipes", {recipes: data});
    });
});

app.get("/:recipeId", (req, res) => {
    const sql_route = `select * from recipes where id="${req.params.recipeId}"`;
    connection.query(sql_route, (err, data_route) => {
        if (err) throw err;
        console.log("Route_data:", data_route);
        const sql_ingr = "select ri.recipe_id, i.name as 'name', ri.measurement_qty as 'amount', mu.name as 'unit' from recipe_ingredients ri join ingredients i on i.id = ri.ingredient_id left outer join measurement_units mu on mu.id = measurement_id where recipe_id = 1;"
        connection.query(sql_ingr, (err, data_ingr) => {
            if (err) throw err;
            console.log("Ingredients:", data_ingr);
            res.render("recipe-id", {ingredients: data_ingr, recipe: data_route[0]});
        });
    });
});

app.listen(PORT, () => {
    console.log("Server is listening on: http://localhost:" + PORT);
});