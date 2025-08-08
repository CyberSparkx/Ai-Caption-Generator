const mongoose= require('mongoose');

const connectDB= async()=>{
    try {
       await  mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("Connected To DB");
            
        })
    } catch (error) {
        console.log(error);
        
    }
}

module.exports=connectDB;