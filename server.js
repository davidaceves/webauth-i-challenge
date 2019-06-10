const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const SessionStore = require("connect-session-knex")(session);

const AuthRouter = require("./data/auth/authRouter.js");
const UsersRouter = require("./data/user/usersRouter.js");

const server = express();
const sessionConfig = {
  name: "robot",
  secret: "secret phrase",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false,
    httpOnly: true
  },
  store: new SessionStore({
    knex: require("./data/dbConfig.js"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 60 * 60 * 1000
  })
};

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api", UsersRouter);
server.use("/api/auth", AuthRouter);

module.exports = server;
