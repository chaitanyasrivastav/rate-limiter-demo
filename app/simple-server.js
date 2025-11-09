import express from "express";

const app = express();

// Simulate CPU-heavy work (blocking)
function heavyComputation() {
  const start = Date.now();
  while (Date.now() - start < 2000) {} // simulate 2s CPU work
}

app.get("/", (req, res) => {
  heavyComputation();
  res.send("✅ Request processed successfully!");
});

app.listen(8080, () => console.log("Server running on port 8080"));