const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport) {
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        connection.query(`select * from users where id = "${id}"`, (err, rows) => done(err, rows[0]));
    });

    passport.use("local-signup", new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        }, (req, email, password, done) => {
            connection.query(`select * from users where email = "${email}"`, (err, data) => {
                console.log(data);
                console.log("above row object");
                try {
                    if (data.length) {
                        return done(null, false, {message: "The email is already taken"});
                    } else {
                        const newUser = new Object();
                        newUser.id = id;
                        newUser.username = username;
                        newUser.email = email;
                        newUser.password = hashPassword;

                        const sql_newUser = `insert into users (id, username, email, password) values ("${id}", "${username}", "${email}", "${password}"`;
                        connection.query(sql_newUser, (err, data) => {
                            return done(null, newUser);
                        });
                    }
                } catch (err) {
                    return done(err);
                }
            });
        }
    ));

    passport.use("local-login", new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        }, (req, email, password, done) => {
            connection.query(`select * from users where email = "${email}"`, (err, data) => {
                if (!data.length) {
                    return done(null, false, {message: "No user with that email"});
                }
                try {
                    if (bcrypt.compare(password.data[0].password)) {
                        return done(null, data[0].email)
                    } else {
                        return done(null, false, {message: "Password incorrect"})
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

module.exports = initialize;