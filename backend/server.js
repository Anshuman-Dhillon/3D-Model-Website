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
connectDB()

//allow the backend to return json objects
app.use(express.json())

app.use("/api/models", routes)

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`)
})