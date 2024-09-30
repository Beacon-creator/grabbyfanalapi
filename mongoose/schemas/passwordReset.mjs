import mongoose from 'mongoose'; // Import mongoose
import { Schema } from "mongoose";

const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    verificationCode: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    }
});

// Create a model from the schema
const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;
