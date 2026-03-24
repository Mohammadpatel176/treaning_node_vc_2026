const Address = require('ipaddr.js')
const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "name is required for creating an account"]
    },
    email: {
        type: String,
        required: [true, "Email is require for creating user"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
        unique: [true, "Email already exists."]
    },
    password: {
        type: String,
        required: [true, "password is required for creating an account"]
    },
    phoneNo: {
        type: String,
        match: [/^\d{10}$/],
        trim: true,
        required:  [true, "phone number is required"]
    },
    street: {
        type: String,
        required:  [true, "street is required"]
    },
    state: {
        type: String,
        required:  [true, "state is required"]
    },
    country: {
        type: String,
        required:  [true, "country is required"]
    },
    dob: {
        type: Date,
        required:  [true, "Date of birth is required"],
        validate: {
            validator: function (value) {
                return value < new Date(); // past date only
            },
            message: "DOB must be in the past"
        }
    },
    documents : [{
        type:String
    }]
}, {
    timeStamp: true
})

const customer = mongoose.model("customer", customerSchema);

module.exports = customer;