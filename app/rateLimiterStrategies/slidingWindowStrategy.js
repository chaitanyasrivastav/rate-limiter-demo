const WINDOW_SIZE_IN_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

// In-memory store: { ip: [timestamps] }
const requestLogs = new Map();

function slidingWindowStrategy(req, res, next) {
    const currentTime = Date.now();
    const key = req.headers['x-user-id'];

    // Get logs for this user
    let timestamps = requestLogs.get(key) || [];

    // Remove timestamps outside the window
    timestamps = timestamps.filter(ts => currentTime - ts < WINDOW_SIZE_IN_MS);

    if (timestamps.length >= MAX_REQUESTS) {
        console.log(`User ${key} - 429 Too many requests, Timestamps: [${timestamps.map(ts => new Date(ts).toISOString()).join(", ")}]`);
        return res.status(429).json({
            message: "Too many requests. Try again later."
        });
    }

    // Add current request timestamp
    timestamps.push(currentTime);
    requestLogs.set(key, timestamps);
    console.log(`User ${key} - Count: ${timestamps.length}, Timestamps: [${timestamps.map(ts => new Date(ts).toISOString()).join(", ")}]`);

    next();
}

export { slidingWindowStrategy };