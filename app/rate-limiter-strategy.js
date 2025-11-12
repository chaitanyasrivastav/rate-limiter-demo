import * as rateLimiter from "./rateLimiterStrategies/index.js";
function rateLimiterStrategy(req, res, next) {
    switch (process.env.STRATEGY) {
        case "fw":
            // Apply fixed window strategy
            console.log("Applying fixed window strategy");
            rateLimiter.fixedWindowStrategy(req, res, next);
            break;
        case "sw":
            // Apply sliding window strategy
            console.log("Applying sliding window strategy");
            rateLimiter.slidingWindowStrategy(req, res, next);
            break;
        case "tb":
            // Apply token bucket strategy
            console.log("Applying token bucket strategy");
            rateLimiter.tokenBucketStrategy(req, res, next);
            break;
        case "lb":
            // Apply leaky bucket strategy
            console.log("Applying leaky bucket strategy");
            rateLimiter.leakyBucketStrategy(req, res, next);
            break;
        default:
            console.log("No valid strategy specified, proceeding without rate limiting");
            next();
            break;
    }
}

export { rateLimiterStrategy };