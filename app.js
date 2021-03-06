const express = require("express");
const bp = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
require("dotenv").config();

const app = express();

app.use(bp.json());
app.use(cors());

// MySQL connection - creates database if empty

const con = mysql.createConnection(process.env.DB);

con.connect((err) => {
  if (err) throw err;
  con.query("SHOW TABLES LIKE 'todos'", (err, result) => {
    if (err) console.log(err);
    if (result.length === 0) {
      con.query(
        "CREATE TABLE todos (id int AUTO_INCREMENT PRIMARY KEY, todo TEXT)",
        (err, result) => {
          if (err) console.log(err);
          else console.log("Database created: " + result);
        }
      );
    } else {
      console.log("Connected to database and is accessible");
    }
  });
});

// GET request to retrieve all todos

app.get("/", (req, res) => {
  con.query("SELECT * FROM todos", (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("Issue getting data");
    } else {
      res.json(result);
    }
  });
});

// POST request to add todo to database

app.post("/", (req, res) => {
  if (req.body.todo) {
    con.query(
      `INSERT INTO todos (todo) VALUES ('${req.body.todo}')`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(400).send("Error inserting a task");
        } else {
          res.json(result);
        }
      }
    );
  } else {
    res.status(400).send("No todo has been passed");
  }
});

// Delete request from database

app.delete("/delete/:todo", (req, res) => {
  con.query(
    `DELETE FROM todos WHERE todo = '${req.params.todo}'`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send("Failed to delete task");
      } else {
        res.send(result);
      }
    }
  );
});

// Getting port from env file or resorting to default

const port = process.env.PORT || 3000;

// Starting the application on defined port

app.listen(port, () => console.log("The server is running on port: " + port));
