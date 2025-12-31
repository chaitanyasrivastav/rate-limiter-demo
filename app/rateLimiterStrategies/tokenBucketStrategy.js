class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = 10;
    this.refillRate = refillRate; // tokens per millisecond
    this.lastRefill = Date.now();
  }

  allow() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    // Refill tokens
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;

    // Check permission
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

const requestLogs = new Map();

function tokenBucketStrategy(req, res, next) {
    const key = req.headers['x-user-id'];
    if (!requestLogs.has(key)) {
        const bucket = new TokenBucket(50, 10 / 60000); // 50-token capacity, 10 tokens per minute refill
        requestLogs.set(key, bucket);
        console.log(`Tokens: ${Math.floor(bucket.tokens)}, Now: ${new Date().toISOString()}`);
    }
    const bucket = requestLogs.get(key);
    if (bucket.allow()) {
        console.log(`Tokens: ${Math.floor(bucket.tokens)}, Now: ${new Date().toISOString()}`);
        next();
    } else {
        console.log(`429 Rate limit exceeded, Tokens: ${Math.floor(bucket.tokens)}, Now: ${new Date().toISOString()}`);
        res.status(429).send("Rate limit exceeded");
    }
}

export { tokenBucketStrategy };