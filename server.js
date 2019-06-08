const express = require("express");
const server = express();
const helmet = require("helmet");

const UserRouter = require("./data/user/userRouter.js");

server.use(express.json());
server.use(helmet());
server.use("/api/users", UserRouter);

module.exports = server;
