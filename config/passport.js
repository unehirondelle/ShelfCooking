const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const connection = require("./connection.js");

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
}

module.exports = initialize;