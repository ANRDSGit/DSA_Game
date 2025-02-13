require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

let players = {}; // Store player positions

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a new player joins
  socket.on("newPlayer", (playerData) => {
    players[socket.id] = playerData;
    io.emit("updatePlayers", players);
  });

  // When a player moves
  socket.on("move", (playerData) => {
    players[socket.id] = playerData;
    io.emit("updatePlayers", players);
  });

  // When a player disconnects
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
