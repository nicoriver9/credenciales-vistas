const express = require("express");
const morgan = require("morgan");
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require("body-parser");
const path = require("path");
const MySQLStore = require('express-mysql-session')(session);

const server = require("./config.js")
const routes = require("./routes/user-routes.routes");
const routesAuth = require("./routes/authentication.routes");
const { database } = require('./database');

const app = express();
require('./lib/passport');

//Settings
app.set('view engine', 'hbs');

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'balcarseMedicalCenter',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash("message");
  app.locals.success = req.flash("success");
  app.locals.error = req.flash("error");
  app.locals.errors = req.flash("errors");
  app.locals.user = req.user;
  next();
});


//Routes
app.use("/",routes);
app.use("/",routesAuth);


app.listen (3000, () =>{
    console.log("app on port ", server.port);
})


