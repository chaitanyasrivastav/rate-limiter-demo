import http from "http";
import express from "express";
import { rateLimiterStrategy } from "./rate-limiter-strategy.js";

const app = express();

app.use((req, res, next) => {
  rateLimiterStrategy(req, res, next);
});

async function heavyComputationAsync() {
  await new Promise(res => setTimeout(res, 2000));
}

function heavyComputation() {
  const start = Date.now();
  while (Date.now() - start < 2000) {} // simulate 2s CPU work
}

app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`Response time for ${req.method} ${req.originalUrl}: ${durationMs.toFixed(3)} ms`);
  });
  next();
});

app.get("/async", async (req, res) => {
  const userId = req.headers["x-user-id"] || "anonymous";
  console.log(`User: ${userId} hit the server`);
  await heavyComputationAsync();
  res.send(`Processed request for user ${userId}`);
});

app.get("/", (req, res) => {
  const userId = req.headers["x-user-id"] || "anonymous";
  console.log(`User: ${userId} hit the server`);
  heavyComputation();
  res.send(`Processed request for user ${userId}`);
});

const server = http.createServer(app);

server.on("connection", (socket) => {
  socket.on("error", (err) => {
    console.log("Socket error:", err.code);
  });
});

server.listen(8080, () => {
  console.log("Server running on port 8080");
});