const express = require("express")
const authController = require("../controllers/authController")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/login",authController.login)

router.post("/register",authMiddleware,authController.register)

router.get("/me",authMiddleware,authController.getProfile)

module.exports = router