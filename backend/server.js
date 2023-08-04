const app = require("./app");
const dotenv =require("dotenv");
const connectDB = require("./config/database");
const cloudinary = require("cloudinary")

//Handling uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhande Exception");
    process.exit(1);
})


dotenv.config({path:"backend/config/config.env"})
connectDB();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET    
})

const server = app.listen(process.env.PORT , ()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})



//unhandle promise rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhande Promise rejection");

    server.close(()=>{
        process.exit(1);
    })
})