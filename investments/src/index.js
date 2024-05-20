const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const investments = require("../src/data.json");
const R = require("ramda");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments", (req, res) => {
  res.send(investments);
});

app.get("/investments/:id", (req, res) => {
  const { id } = req.params;
  const investment = R.filter(R.propEq("id", id), investments);
  res.send(investment);
});

app.post("/investments/export", (req, res) => {
  const { csv } = req.body;
  const filePath = path.join(__dirname, 'investments.csv');

  fs.writeFile(filePath, csv, (err) => {
    if (err) {
      console.error("Error writing CSV file:", err);
      return res.status(500).send("Internal Server Error");
    }
    console.log("CSV file written successfully:", filePath);
    res.status(204).send();
  });
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});

module.exports = app;
