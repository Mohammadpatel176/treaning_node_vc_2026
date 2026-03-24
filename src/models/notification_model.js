const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: String,
    type: {
        type: String,
        enum: ["TRANSACTION","ALERT","SYSTEM"],
        default: "SYSTEM"
    },
    isRead: {
        type: Boolean,
        default: false
    },
    metadata: {
        amount: Number,
        transactionId: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Notification", notificationSchema);