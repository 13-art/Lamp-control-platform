const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let lampStates = {};

// Change one lamp
app.post("/api/lamp/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  lampStates[id] = status;
  io.emit("statusUpdated", { id, status });
  res.json({ success: true, id, status });
});

// Change all lamps
app.post("/api/lamp/status-all", (req, res) => {
  const { status } = req.body;
  for (let i = 1; i <= 100; i++) {
    const id = i.toString().padStart(3, "0");
    lampStates[id] = status;
    io.emit("statusUpdated", { id, status });
  }
  res.json({ success: true });
});

// Get all lamp statuses
app.get("/api/lamp/statuses", (req, res) => {
  res.json(lampStates);
});

// Start the server
server.listen(3001, () => {
  console.log("✅ Backend running at http://localhost:3001");
});