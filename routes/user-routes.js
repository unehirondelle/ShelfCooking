const passport = require("passport");
const initialize = require("../config/passport");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const connection = require("../config/connection");

module.exports = function (app) {

    initialize(passport);

    app.use(flash());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(methodOverride("_method"));

    app.get("/login", checkNotAuthenticated, (req, res) => {
        res.render("login");
    });

    app.post("/login", checkNotAuthenticated, passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }));

    app.get("/", checkAuthenticated, (req, res) => {
        const sql_rec = "select distinct (type) from recipes;"
        connection.query(sql_rec, (err, data) => {
            if (err) throw err;
            res.render("index", {type: data});
        });

    });

    app.get("/signup", checkNotAuthenticated, (req, res) => {
        res.render("signup");
    });

    app.post("/signup", checkNotAuthenticated, async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const sql_email = `select * from users where email = "${req.body.email}"`;
            connection.query(sql_email, (err, data) => {
                if (err) throw err;
                if (data.length === 0) {
                    const sql = `insert into users (id, username, email, password) values ("${Date.now().toString()}", ?, ?, "${hashedPassword}")`;
                    connection.query(sql, [req.body.username, req.body.email], (err, data) => {
                        if (err) throw err;
                        res.redirect("/");
                    });
                }
            })
        } catch {
            res.redirect("/signup");
        }
    });

    app.delete("/logout", (req, res) => {
        req.logOut();
        res.redirect("/login");
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

}