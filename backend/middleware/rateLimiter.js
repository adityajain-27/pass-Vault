import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {success:false, message: "Too many requests from this IP, please try again after 15 minutes"},
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // it means 15 minutes
    max: 10, // it means 10 attempts
    message: {success:false, message: "Too many authentication attempts from this IP, please try again after 15 minutes"}
});