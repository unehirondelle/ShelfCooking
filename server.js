require('dotenv').config();

const express = require("express");
const exprhnlbs = require("express-handlebars");
const mysql = require("mysql");
const path = require("path");
const dir = path.join(__dirname, 'public');
const fs = require("fs");
/*const multer = require("multer");
const upload = multer({dest: path.join(dir, 'img/uploads/')});*/
const exprflupld = require("express-fileupload");
const bcrypt = require("bcrypt"); //encrypts password
const passport = require("passport"); //user authentication

const LocalStrategy = require("passport-local").Strategy;

const flash = require("express-flash"); //send messages for passport issues
const session = require("express-session"); //create a session with its ID that is stored server-side
const methodOverride = require("method-override"); //to override post method with delete

const PORT = process.env.PORT || 3010;

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

// const initializePassport = require("./passport-config");

function initialize(passport) {
    passport.serializeUser((user, done) => {
        console.log("serializeUser: ", user);
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        console.log("deserializeUser: ", user);
        connection.query("select * from users where email = ?", [user], (err, rows) => {
            console.log("deSer result: ", rows);
            done(err, rows[0].id);
        });
    });

    /*passport.use("local-signup", new LocalStrategy({
            usernameField: "email"
        }, (req, email, done) => {
            // const hashedPassword = await bcrypt.hash(req.body.password, 10);
            connection.query("select * from users where email = ?", [email], (err, data) => {
                console.log("loc-sign: ", data.length);
                if (data.length > 0) {
                    return done(null, false, {message: "The email is already taken"});
                } else {
                    console.log(req.body)

                }
                /!*try {
                    if (data.length === 0) {
                        const newUser = new Object();
                        newUser.id = Date.now().toString();
                        newUser.username = req.body.username;
                        newUser.email = req.body.email;
                        newUser.password = hashedPassword;

                        const sql_newUser = `insert into users (id, username, email, password) values ("${Date.now().toString()}", "${req.body.username}", "${req.body.email}", "${hashedPassword}"`;
                        connection.query(sql_newUser, (err, data) => {
                            console.log("SQL: ", sql_newUser);
                            console.log("newUser: ", data);
                            return done(null, data);
                        });
                    }
                        } catch (err) {
                    return done(err);
                }*!/
            });
        }
    ));*/

    passport.use("local-login", new LocalStrategy({
            usernameField: "email"
        }, (email, password, done) => {
            connection.query("select * from users where email = ?", [email], async (err, data) => {
                // console.log("loc-log data: ", data);
                if (!data.length) {
                    return done(null, false, {message: "No user with that email"});
                }
                try {
                    if (await bcrypt.compare(password, data[0].password)) {
                        return done(null, data[0].email);
                    } else {
                        return done(null, false, {message: "Password incorrect"});
                    }
                } catch (err) {
                    return done(err);
                }
            });
        }
    ));


    /*const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, {message: "No user with that email"});
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {message: "Password incorrect"});
            }
        } catch (err) {
            return done(err);
        }
    }*/

}

initialize(passport);
/*
initializePassport(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id));
*/

// const users = [];


const app = express();

app.use(express.static(dir));

app.use(express.urlencoded({extended: true}));

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method")); //_method is how it will be called

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


app.get("/", checkAuthenticated, (req, res) => {
    const sql_rec = "select distinct (type) from recipes;"
    connection.query(sql_rec, (err, data) => {
        if (err) throw err;
        res.render("index", {type: data});
    });
    // res.render("index", {type: data, username: req.user.username});

});

/*app.get("/", checkAuthenticated, (req, res) => {
    res.render("index", {username: req.user.username});
});*/

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login");
});

app.post("/login", checkNotAuthenticated, passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

app.get("/signup", checkNotAuthenticated, (req, res) => {
    res.render("signup");
});

/*app.post("/signup", checkNotAuthenticated, passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash: true
}));*/


app.post("/signup", checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); //create a hashed pswd, generated 10 times for security reasons
        const sql_email = `select * from users where email = "${req.body.email}"`;
        connection.query(sql_email, (err, data) => {
            if (err) throw err;
            if (data.length === 0) {
                const sql = `insert into users (id, username, email, password) values ("${Date.now().toString()}", ?, ?, "${hashedPassword}")`;
                connection.query(sql, [req.body.username, req.body.email], (err, data) => {
                    if (err) throw err;

                });
            } /*else {
                req.flash('error', "The email is already taken");
            }*/

        })
    } catch {
        res.redirect("/signup");
    }
});

app.delete("/logout", (req, res) => {
    req.logOut(); //built-in into passport
    res.redirect("/login");
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

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

app.listen(PORT, () => {
    console.log("Server is listening on: http://localhost:" + PORT);
});

