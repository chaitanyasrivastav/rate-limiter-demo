import express from "express";
import { rateLimiterStrategy } from "./rate-limiter-strategy.js";

const app = express();

app.use((req, res, next) => {
  rateLimiterStrategy(req, res, next);
});

function heavyComputation() {
  const start = Date.now();
  while (Date.now() - start < 2000) {} // simulate 2s CPU work
}

app.get("/", (req, res) => {
  const userId = req.headers["x-user-id"] || "anonymous";
  console.log(`User: ${userId} hit the server`);
  heavyComputation();
  res.send(`Processed request for user ${userId}`);
});

app.listen(8080, () => console.log("Server running on port 8080"));