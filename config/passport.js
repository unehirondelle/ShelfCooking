const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const dbConnection = require("./connection.js");

function initialize(passport) {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        dbConnection.queryExecutor(
            "select * from users where email = ?",
            [user],
            (err, data) => {
                done(err, data[0].id);
            }
        );
    });

    passport.use("local-login", new LocalStrategy({
            usernameField: "email"
        }, (email, password, done) => {
            dbConnection.queryExecutor(
                "select * from users where email = ?",
                [email],
                async (err, data) => {
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
                }
            );
        }
    ));
}

module.exports = initialize;