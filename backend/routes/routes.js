import express from "express"

const router = express.Router()

router.get("/", (req, res) => {
    res.status(200).send("hello world")
})

router.post("/", (req, res) => {
    res.status(201).send("hello world")
})


export default router;