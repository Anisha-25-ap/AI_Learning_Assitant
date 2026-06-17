import mongoose from "mongoose";
import dotenv from "dotenv";

// .env file ko load karne ke liye
dotenv.config(); 

const connectDB = async () => {
  try {
    // 1. Galti: Sirf MONGO_URI nahi, process.env.MONGO_URI likhna hoga
    // 2. Galti: connection string ko bracket ke andar sahi se band karna hoga
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Agar Atlas connect nahi ho raha, toh ye line aapko batayegi kyun
    process.exit(1); 
  }
};

export default connectDB;