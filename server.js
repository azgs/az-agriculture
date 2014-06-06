var express = require("express");
var fs = require("fs");
var path = require("path");

var app = express();

var style = path.join(__dirname, "style");
var script = path.join(__dirname, "scripts");
var vendor = path.join(__dirname, "vendor");
var home = path.join(__dirname, "index.html");
var farms = path.join(__dirname, "data", "farms.json");

app.use("/style", express.static(style));
app.use("/scripts", express.static(script));
app.use("/vendor", express.static(vendor));

app.get("/", function (req, res) {
  fs.readFile(home, "utf8", function (err, text) {
    res.send(text);
  })
});

app.get("/farms.json", function (req, res) {
  fs.readFile(farms, "utf8", function (err, text) {
    var data = JSON.parse(text);
    res.json(data);
  })
});

var server = app.listen(3000, function () {
  console.log("Listening on port %d", server.address().port);
});