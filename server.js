const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const SessionStore = require("connect-session-knex")(session);

const AuthRouter = require("./data/auth/authRouter.js");
const UsersRouter = require("./data/user/usersRouter.js");

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/api", UsersRouter);
server.use("/api/auth", AuthRouter);

module.exports = server;
