import jwt from "jsonwebtoken";

export default function authenticated(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).json({ message: "Authentication required" });

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ message: "Token expired or invalid" });
        req.user = user;
        next();
    });
}
