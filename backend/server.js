import express from "express"
import routes from "./routes/routes.js"
import {connectDB} from "./config/db.js"
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/error.js";

//PORT configuration
const PORT = process.env.PORT || 5000;

const app = express()
connectDB()

//allow the backend to return json objects
app.use(express.json())

app.use("/api/models", routes)

// If no route matched → 404
app.use(notFound);

// If any error occurred → handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`)
})

//mongodb+srv://anshumandhillon:DzbXJYJnI5OalduF@cluster0.fcjoyjo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0