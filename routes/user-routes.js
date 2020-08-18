const passport = require("passport");
const initialize = require("../config/passport");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const dbConnection = require("../config/connection");
const auth = require("../helpers/checkAuthenticated");
const mySQLStore = require("express-mysql-session")(session);

const sessionConnection = dbConnection.sessionConnection;

console.log("created session storage connection", sessionConnection);
const sessionStore = new mySQLStore({
    checkExpirationInterval: 900000,// How frequently expired sessions will be cleared; milliseconds.
    expiration: 86400000,// The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, sessionConnection);


module.exports = function (app) {

    initialize(passport);
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
        cookie: { maxAge: 60000 },
        rolling: true,
        store: sessionStore
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride("_method"));

    app.get("/login", auth.checkNotAuthenticated, (req, res) => {
        res.render("login");
    });

    app.post("/login", auth.checkNotAuthenticated, passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }));

    app.get("/", auth.checkAuthenticated, (req, res) => {
        const sql = "select distinct (type) from recipes;";
        dbConnection.queryExecutor(
            sql,
            null,
            (err, data) => {
                if (err) throw err;
                res.render("index", {type: data});
            }
        );
    });

    app.get("/signup", auth.checkNotAuthenticated, (req, res) => {
        res.render("signup");
    });

    app.post("/signup", auth.checkNotAuthenticated, async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            dbConnection.queryExecutor(
                `select * from users where email = "${req.body.email}"`,
                null,
                (err, data) => {
                    if (err) throw err;
                    if (data.length === 0) {
                        dbConnection.queryExecutor(
                            `insert into users (username, email, password) values (?, ?, "${hashedPassword}")`,
                            [req.body.username, req.body.email],
                            (err) => {
                                if (err) throw err;
                                res.redirect("/");
                            }
                        );
                    } else
                    return res.status(401).render("signup", {message: "There is a user with such email"});
                }
            );

        } catch (err) {
            res.redirect("/signup");
        }
    });

    app.delete("/logout", (req, res) => {
        req.logOut();
        res.redirect("/login");
    });

}