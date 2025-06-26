import express from "express"
import routes from "./routes/routes.js"
import {connectDB} from "./config/db.js"
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/error.js";
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

//PORT configuration
const PORT = process.env.PORT || 5000;

const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/models", routes)

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