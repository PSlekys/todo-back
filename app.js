const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

const app = express();

app.use(bp.json());
app.use(cors());

// Demo GET

app.get("/", (req, res) => res.send("ok"));

// Getting port from env file or resorting to default

const port = process.env.PORT || 3000;

// Starting the application on defined port

app.listen(port, () => console.log("The server is running on port: " + port));
