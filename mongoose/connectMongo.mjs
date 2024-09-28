import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateInex: true,
        });
        console.log(`Connected to MongoDB database successfully `);
    } catch (error) {
        console.log("Connect failed" + error.message);
    }
};

export default connectDB;
