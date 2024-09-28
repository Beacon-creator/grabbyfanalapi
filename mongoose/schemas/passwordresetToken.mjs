const passwordResetTokenSchema = new Schema({
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    token: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    }
});

// Create a model from the schema
const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

export default PasswordResetToken;
