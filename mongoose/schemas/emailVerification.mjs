import mongoose from 'mongoose';


const emailVerificationSchema = new mongoose.Schema({
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
const EmailVerification = mongoose.model('EmailVerification', emailVerificationSchema);

export default EmailVerification;
