const express = require("express")
const cookieparser = require("cookie-parser")
const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(express.json())
app.use(cookieparser())

app.use("/api/auth",authRoutes)

app.get("/", (req, res) => {
    res.send("API Running...")
})

module.exports = app