const express = require("express");
const exprhnlbs = require("express-handlebars");
const mysql = require("mysql");
require('dotenv').config();
const path = require("path");
const dir = path.join(__dirname, 'public');
const fs = require("fs");
/*const multer = require("multer");
const upload = multer({dest: path.join(dir, 'img/uploads/')});*/
const exprflupld = require("express-fileupload");

const app = express();

const PORT = process.env.PORT || 3010;

app.use(express.static(dir));

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(exprflupld({
    limits: {fileSize: 50 * 1024 * 1024},
}));

app.engine("handlebars", exprhnlbs({defaultLayout: "main"}));

app.set("view engine", "handlebars");

/*const imageFilter = (req, recipeImage, cb) => {
    if (recipeImage.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

let storage = multer.diskStorage({
    destination: (req, recipeImage, cb) => {
        cb(null, path.join(dir, "img/uploads/"));
    },
    filename: (req, recipeImage, cb) => {
        cb(null, `${recipeImage.originalname}`);
    },
});

let uploadFile = multer({dest: upload, storage: storage, fileFilter: imageFilter});*/

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
        let buffer = Buffer.from(data[0].image, 'binary');
        res.write(buffer);
        res.end()
    });
});

app.get("/add-recipe", (req, res) => {
    res.render("add-recipe");
});

/*app.post("/cookbook", uploadFile.single('recipeImage'), (req, res) => {
    const sql = "insert into recipes (name, method, time, person_num, type, image) values (?, ?, ?, ?, ?, ?)";
    let image = fs.readFileSync(
        __dirname + "/public/img/uploads/" + req.file.filename
    );
    connection.query(sql, [req.body.recipeName, req.body.method, req.body.recipeTime, req.body.portions, req.body.recipeCategory, image], (err, data) => {
        if (err) throw err;
        console.log("file:", req.recipeImage);
        console.log("image:", image);
        console.log("imageField:", req.body.image);
        res.redirect("/cookbook");
    });
});*/

app.post("/cookbook", (req, res) => {
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
});

app.listen(PORT, () => {
    console.log("Server is listening on: http://localhost:" + PORT);
});

