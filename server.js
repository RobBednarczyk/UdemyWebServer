const express = require("express");
const hbs = require("hbs");

// load the fs module to store the log with all the request in a files
const fs = require("fs");

// store the port no. for heroku deployment
// heroku will set the PORT variable, otherwise run locally on 3000
const port = process.env.PORT || 3000;

var app = express();

// set the partials - code reused
hbs.registerPartials(__dirname + "/views/partials");

// set the hbs as the view engine
app.set("view engine", "hbs");


// define some middleware
app.use((req, res, next) => {
    // creates a human readable timestamp
    var now = new Date().toString();
    console.log(`${now}: ${req.method} ${req.path}`);
    fs.appendFile("requestLog.txt", `${now}: ${req.method} ${req.path}\n`, (err) => {
        if (err) {
            console.log("Unable to log the request");
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render("maintenance.hbs");
// });

// configure some middleware - serving static files
app.use(express.static(__dirname + "/public"));

// register a helper function
hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
})

// set up a handler for the express http request
app.get("/", (req, res) => {
    //res.send("<h1>Hello Express!</h1>");
    // send JSON back
    // legacy
    // res.send({
    //     name: "Robert",
    //     hobbies: ["football", "running", "movies"],
    // })
    res.render("home.hbs", {
        pageTitle: "Welcome page",
        //currentYear: new Date().getFullYear(),
        welcomeMessage: "Hello World!",
    });
});

app.get("/about", (req, res) => {
    //res.send("About Page");
    // render any of the set up templates with the current view engine
    res.render("about.hbs", {
        pageTitle: "About page",
        //currentYear: new Date().getFullYear(),
    });
});

app.get("/bad", (req, res) => {
    res.send({
        error: "Unable to fulfil this request",
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
