const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /^\S+@\S+\.\S+$/
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        role:{
            type: String,
            enum: ["admin","manager","employee"],
            default: "employee"
        },
        isActive: {
            type: Boolean,
            default: true
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
)

userSchema.pre("save", async function () {

    if (!this.isModified("password")) return

    this.password = await bcrypt.hash(this.password, 10)
    
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
