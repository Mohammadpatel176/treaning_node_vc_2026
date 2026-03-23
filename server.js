const app = require('./src/app');
const dotenv = require('dotenv');

const connectDB = require('./src/config/db');

connectDB();

app.listen(process.env.PORT,()=>{
    console.log(`server is started on port ${process.env.PORT}`)
})

