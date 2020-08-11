require('dotenv').config();

const express = require("express");
const exprhnlbs = require("express-handlebars");
const path = require("path");
const dir = path.join(__dirname, 'public');
const fs = require("fs");

const PORT = process.env.PORT || 3010;

const app = express();

app.use(express.static(dir));

app.use(express.urlencoded({extended: true}));

require("./routes/user-routes")(app);
require("./routes/cookbook-routes")(app);

app.use(express.json());

app.engine("handlebars", exprhnlbs({defaultLayout: "main"}));

app.set("view engine", "handlebars");

app.listen(PORT, () => {
    console.log("Server is listening on: http://localhost:" + PORT);
});