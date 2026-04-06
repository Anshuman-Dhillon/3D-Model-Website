import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // limit each IP to 100 requests per windowMs

    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res, next) => {
        res.status(429).json({
            message: "Too many requests. Please try again later."
        });
    },
});

export default apiLimiter;