import "./config/env.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import routes from "./routes/routes.js"
import {connectDB} from "./config/db.js"
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/error.js";
import apiLimiter from "./middleware/rateLimiter.js";
import { stripeWebhook } from "./controllers/payments.js";

// Load environment variables from .env file — handled by config/env.js (must be first import)

//PORT configuration
const PORT = process.env.PORT || 5000;

const app = express()

// Stripe webhook needs raw body — must be before express.json()
app.post("/api/transactions/webhook", express.raw({ type: "application/json" }), stripeWebhook);

//middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(apiLimiter)

app.use("/api", routes)

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`)
})
}).catch((error) => {
    console.error("Database connection failed:", error)
    process.exit(1)
})