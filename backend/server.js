import express from "express"
import routes from "./routes/routes.js"
import {connectDB} from "./config/db.js"

const app = express()
connectDB()

app.use("/api/models", routes)

app.listen(5000, () => {
    console.log("Server started on PORT: 5000")
})

//mongodb+srv://anshumandhillon:DzbXJYJnI5OalduF@cluster0.fcjoyjo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0