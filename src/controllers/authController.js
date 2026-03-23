const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

// 🔐 Generate JWT Token (helper inside controller)
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // find user + include password
        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        // compare password
        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // generate token
        const token = generateToken(user)

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const register = async (req, res) => {
    try {
        const currentUser = req.user   // from middleware

        // only admin can create users
        if (currentUser.role !== "admin") {
            return res.status(403).json({ message: "Only admin can create users" })
        }

        const { name, email, password, role } = req.body

        // check existing user
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        // create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            createdBy: currentUser._id
        })

        res.status(201).json({
            message: "User created successfully",
            user
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        res.json(user)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


module.exports = {
    login,
    register,
    getProfile
}