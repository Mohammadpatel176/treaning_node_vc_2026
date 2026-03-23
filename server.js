require("dotenv").config();

const connectDB = require("./src/config/db");
const app = require("./src/app")

connectDB();

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});

