import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {success:false, message: "Too many requests from this IP, please try again after 15 minutes"},
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {success:false, message: "Too many authentication attempts from this IP, please try again after 15 minutes"}
});