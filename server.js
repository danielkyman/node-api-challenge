const express = require("express");
const actionRouter = require("./data/helpers/actionRouter.js");
const projectRouter = require("./data/helpers/projectRouter.js");
const helmet = require("helmet");

const server = express();

server.use(helmet());

server.use(express.json());

server.use("/api/actions", actionRouter);
server.use("/api/projects", projectRouter);

server.get("/", (req, res) => {
  res.send(`<h1>Welcome to the node sprint API!</h1>`);
});

module.exports = server;
