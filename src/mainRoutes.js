const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { example, createPerson } = require("./services/testDB");
const { createGame, prevGameID } = require("./services/lobby.js");

const mainRouter = express.Router();

mainRouter.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

mainRouter.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});
mainRouter.get("/form", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "form.html"));
});

mainRouter.get("/api/testconnection", async function (req, res) {
  const result = await example();
  res.send(result);
});
mainRouter.use(bodyParser.urlencoded({ extended: false }));
mainRouter.use(bodyParser.json());

mainRouter.post("/send", async function (req, res) {
  const result = await createPerson(
    1,
    req.body.lastName,
    req.body.firstName,
    req.body.address,
    req.body.city
  );
  res.send(result);
});

mainRouter.post("/lobby", async function (req, res) {
  res.sendFile(path.join(__dirname, "views", "lobby.html"));
});

mainRouter.post("/game", async function (req, res) {
  let prevResult = await prevGameID();
  //BUG!!: newID = parseInt(prevResult) + 1;
  newID = 4;
  const result = await createGame(req.body.gameModeInput, newID);
  res.sendFile(path.join(__dirname, "views", "game.html"));
});

module.exports = mainRouter;
