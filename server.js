require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")
const User = require("./src/models/userModel")

const PORT = process.env.PORT || 3000

const startServer = async () => {
    try {

        await connectDB()

        const adminExists = await User.findOne({ role: "admin" })

        if (!adminExists) { 
            await User.create({
                name: "Admin",
                email: "admin@gmail.com",
                password: "admin123",
                role: "admin"
            })

            console.log("Admin created ✅")
        }

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })

    } catch (error) {
        console.error("Server Error:", error.message)
    }
}

startServer()