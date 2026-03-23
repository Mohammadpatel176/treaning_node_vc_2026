const Address = require('ipaddr.js')
const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    email: {
        type : String ,
        require : true
    },
    phoneNo :{
        type : String,
        required : true 
    },
    street:{
        type : String,
        required : true
    },
    state: {
          type : String,
        required : true
    },
    dob:{
         type : Date,
        required : true
    }
})

const customer = mongoose.model("customer", customerSchema);

module.exports = customer;