import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config();
const connectdb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected")
    }
    catch (error) {
        console.log(error)
    }
}

export default connectdb