const express = require('express')
const bodyParser = require('body-parser')
const route = require('./routers')

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("welcome to sale management");
});

route(app)

module.exports = app