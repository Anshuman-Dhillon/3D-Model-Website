import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://anshumandhillon:DzbXJYJnI5OalduF@cluster0.fcjoyjo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

        console.log("MONGODB CONNECTED SUCCESSFULLY")
    } catch (error) {
        console.error("ERROR CONNECTING TO MONGODB", error)
        process.exit(1)
    }
}