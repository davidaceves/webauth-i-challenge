const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const db = require("../dbConfig.js");

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

module.exports = router;
