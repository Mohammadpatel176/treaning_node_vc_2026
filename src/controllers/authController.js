const User = require("../models/userModel")
const jwt = require("jsonwebtoken")

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email }).select("+password +refreshTokens")

        if (!user) return res.status(400).json({ message: "User not found" })

        const isMatch = await user.comparePassword(password)
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

        const accessToken = generateToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshTokens.push(refreshToken)
        await user.save()

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax", 
            maxAge: 5 * 60 * 1000 
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

        res.json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken
        if (!token) return res.status(401).json({ message: "No refresh token provided" })

        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

        const user = await User.findById(payload.id).select("+refreshTokens")
        if (!user || !user.refreshTokens.includes(token)) {
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        user.refreshTokens = user.refreshTokens.filter(t => t !== token)

        const newAccessToken = generateToken(user)
        const newRefreshToken = generateRefreshToken(user)
        user.refreshTokens.push(newRefreshToken)
        await user.save()

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 5 * 60 * 1000
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.json({ message: "Access token refreshed"  })
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired refresh token" })
    }
}

const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken
        if (token) {
            const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            const user = await User.findById(payload.id).select("+refreshTokens")
            if (user) {
                user.refreshTokens = user.refreshTokens.filter(t => t !== token)
                await user.save()
            }
        }

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        res.json({ message: "Logged out successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const register = async (req, res) => {
    try {
        const currentUser = req.user
        if (!currentUser || currentUser.role !== "admin") {
            return res.status(403).json({ message: "Only admin can create users" })
        }

        const { name, email, password, role } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: "User already exists" })

        const user = await User.create({
            name,
            email,
            password,
            role,
            createdBy: currentUser._id,
        })

        res.status(201).json({ message: "User created successfully", user })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getProfile = async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    login,
    refreshToken,
    logout,
    register,
    getProfile,
}