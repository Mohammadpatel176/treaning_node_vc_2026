require('dotenv').config();
const mongoose = require("mongoose")

function connectDB (){
    mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("server is connected to database")
    })
    .catch((error)=>{
        console.log("DB connection Error",error);
        process.kill();
    })

}

module.exports = connectDB;