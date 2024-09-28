import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

// Create VerificationCode Schema
const verificationCodeSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    expiryDate: {
        type: Date,
        required: true
    }
});

// Create a model from the schema
const VerificationCode = model('VerificationCode', verificationCodeSchema);

export default VerificationCode;
