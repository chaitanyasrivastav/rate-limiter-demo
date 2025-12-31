// Leaky Bucket rate limiter (queue-based)

const buckets = new Map();
const capacity = 50; // max requests in the bucket
const leakRate = 10; // requests processed per second

export function leakyBucketStrategy(req, res, next) {
  // leakRate = number of requests processed per second
  const leakInterval = 1000 / leakRate; // milliseconds between processing one request
    const userId = req.headers["x-user-id"] || "anonymous";

    if (!buckets.has(userId)) {
      const bucket = {
        queue: [],
      };

      // Start leaking for this user
      bucket.timer = setInterval(() => {
        console.log(`Leaking for user ${userId}, Queue length: ${bucket.queue.length}, Now: ${new Date().toISOString()}`);
        if (bucket.queue.length === 0) return;

        const { resolve } = bucket.queue.shift();
        resolve(); // allow next request to proceed
      }, leakInterval);

      buckets.set(userId, bucket);
    }

    const bucket = buckets.get(userId);

    // If bucket full → reject immediately
    if (bucket.queue.length >= capacity) {
      console.log(`429 Rate limit exceeded, Queue: ${bucket.queue.length}, Now: ${new Date().toISOString()}`);
      return res.status(429).send("Rate limit exceeded (Leaky Bucket overflow)");
    }

    // Wrap next() so bucket controls when request is processed
    bucket.queue.push({
      resolve: () => {
        console.log(`Queue: ${bucket.queue.length}, Now: ${new Date().toISOString()}`);
        next();
      },
      reject: () => {
        console.log(`429 Rate limit exceeded, Queue: ${bucket.queue.length}, Now: ${new Date().toISOString()}`);
        res.status(429).send("Rate limit exceeded (item dropped)");
      },
    });

}