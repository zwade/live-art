const express = require("express");

const app = express();

app.get("/", (req, res) => {
    console.log("Bundle requested");
    res.sendFile(__dirname + "/pwn.html");
});

app.get("/flag", (req, res) => {
    console.log(req.url);
});

app.get("/log", (req, res) => {
    console.log(req.url);
})

app.listen(31337);