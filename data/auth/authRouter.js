const router = require("express").Router();
const bcrypt = require("bcryptjs");

const db = require("../dbConfig.js");
const restricted = require("./restricted-middleware.js");

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
        req.session.user = user;

        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/logout", restricted, (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "There was an error." });
      }
      res.end();
    });
  } else {
    res.end();
  }
});

module.exports = router;
