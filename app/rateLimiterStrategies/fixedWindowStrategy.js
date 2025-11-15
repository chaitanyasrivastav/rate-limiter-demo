
// In-memory store for request counts per key (e.g., IP)
const windowStore = {};

// Configuration: max requests per window and window size in ms
const WINDOW_SIZE_IN_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

function fixedWindowStrategy(req, res, next) {
    const key = req.headers['x-user-id'];
    const now = Date.now();
    if (!windowStore[key]) {
        windowStore[key] = {
            windowStart: now,
            count: 1
        };
        console.log(`User ${key} - Count: ${windowStore[key].count}, Window Start: ${new Date(windowStore[key].windowStart).toISOString()}, Now: ${new Date(now).toISOString()}`);
        next();
        return;
    }
    const window = windowStore[key];
    if (now - window.windowStart < WINDOW_SIZE_IN_MS) {
        if (window.count < MAX_REQUESTS) {
            window.count++;
            console.log(`User ${key} - Count: ${windowStore[key].count}, Window Start: ${new Date(windowStore[key].windowStart).toISOString()}, Now: ${new Date(now).toISOString()}`);
            next();
        } else {
            console.log(`User ${key} - 429 Too many requests, Window Start: ${new Date(windowStore[key].windowStart).toISOString()}, Now: ${new Date(now).toISOString()}`);
            res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }
    } else {
        // Reset window
        windowStore[key] = {
            windowStart: now,
            count: 1
        };
        console.log(`User ${key} - Count: ${windowStore[key].count}, Window Start: ${new Date(windowStore[key].windowStart).toISOString()}, Now: ${new Date(now).toISOString()}`);
        next();
    }
}

export { fixedWindowStrategy };