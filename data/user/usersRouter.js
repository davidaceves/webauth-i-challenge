const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const cors = require("cors");

const db = require("../dbConfig.js");

const server = express();

server.use(cors());

router.post("/register", (req, res) => {
  let user = req.body;

  if (!user.username || !user.password) {
    return res.status(500).json({
      message: "Please enter a username and password."
    });
  }

  if (user.password.length < 8) {
    return res.status(400).json({
      message: "Password must be longer"
    });
  }

  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

  db.insert(user)
    .into("users")
    .then(() => {
      res.status(201).json({ user });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  db("users")
    .where({ username: username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

function authorize(req, res, next) {
  const username = req.headers["x-username"];
  const password = req.headers["x-password"];

  if (!username || !password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  db("users")
    .where({ username: username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        next();
      } else {
        res.status(401).json({
          message: "Invalid credentials"
        });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

router.get("/users", authorize, (req, res) => {
  db("users")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
