const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

async function authMiddleware(req, res, next) {
    try {
        let token = null

        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken
        } else if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Access Token expired"
                })
            }

            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                })
            }

            throw err
        }

        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user 

        next()

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        })
    }
}

module.exports = authMiddleware