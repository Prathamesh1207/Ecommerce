
const mongoose = require("mongoose");
const connectDB = async()=>{

            const conn = await mongoose.connect(process.env.DB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,

            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);

    
    // try{

    // }catch(error){
    //         console.log(`Error: ${error.message}`);
    //         process.exit();
    // }
}

module.exports=connectDB;
