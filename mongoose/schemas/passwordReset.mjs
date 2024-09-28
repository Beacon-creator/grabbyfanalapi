const passwordResetSchema = new Schema({
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
