import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false); // Optional: For handling strict queries, adjust as needed.

const connectDB = async () => {
    try {
        // Mongoose 6.x and above automatically handles options like `useNewUrlParser` and `useUnifiedTopology`
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB database successfully`);
    } catch (error) {
        console.error("Connect failed: " + error.message);
        process.exit(1); // Optionally exit if unable to connect
    }
};

export default connectDB;
