const express = require("express");
const exprhnlbs = require("express-handlebars");
const mysql = require("mysql");
require('dotenv').config();
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3010;

app.use(express.static(path.join(__dirname, 'public')));

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
        user: "root",
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
    const sql_rec = "select distinct (type) from recipes;"
    connection.query(sql_rec, (err, data) => {
        if (err) throw err;
        res.render("index", {type: data});
    });
});

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

app.get("/cookbook/recipes/:recipeName", (req, res) => {
    const sql_route = `select * from recipes where name="${req.params.recipeName}"`;
    connection.query(sql_route, (err, data_route) => {
        if (err) throw err;
        const sql_ingr = "select ri.recipe_id, i.name as 'name', ri.measurement_qty as 'amount', mu.name as 'unit' from recipe_ingredients ri join ingredients i on i.id = ri.ingredient_id left outer join measurement_units mu on mu.id = measurement_id where recipe_id = 1;"
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
        let buffer = Buffer.from(data[0].image, 'binary');
        res.write(buffer);
        res.end()
    });
});

app.get("/add-recipe", (req, res) => {
   res.render("add-recipe");
});

app.post("/cookbook", (req, res) => {
    const sql = "insert into recipes (name, method, time, person_num, type, image) values (?, ?, ?, ?, ?, ?)";
    connection.query(sql, [req.body.recipeName, req.body.method, req.body.recipeTime, req.body.portions, req.body.recipeCategory, req.body.recipeImage], (err, data) => {
        if (err) throw err;
        res.redirect("/cookbook");
    });
});

/*app.post("/cookbook", (req, res) => {
    const sql = "insert into recipes (name, type) values (?)";
    connection.query(sql, [req.body.recipeName], [req.body.recipeCategory], (err, data) => {
        if (err) throw err;
        res.redirect("/cookbook");
    });
});*/

app.listen(PORT, () => {
    console.log("Server is listening on: http://localhost:" + PORT);
});