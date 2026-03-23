const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database is connected');
    }
    catch(err){
        console.log("Error in connecting db");
    }
};

module.exports = connectDB;