const express = require("express");
const server = express();
const helmet = require("helmet");
const cors = require("cors");

const UsersRouter = require("./data/user/usersRouter.js");

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/api", UsersRouter);

module.exports = server;
