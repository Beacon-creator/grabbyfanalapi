import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

// Create User Schema
const userSchema = new Schema({
    fullName: {
        type: String,
        required: false // Not required by default
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensuring unique emails
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Email validation
    },
    phonenumber: {
        type: String,
        required: false // Optional field
    },
    passwordHash: {
        type: Buffer // Storing hashed password as a buffer
    },
    passwordSalt: {
        type: Buffer // Storing password salt as a buffer
    },
    terms: {
        type: Boolean,
       // required: true // Assuming this is a required field
    },
    isEmailVerified: {
        type: Boolean,
        default: false // Default value set to false
    },
    password: {
        type: String,
        required: false, // Not saved in the database
        select: false // Ensure this field is not returned by default
    }
});

// Create a model from the schema
const User = model('User', userSchema);

export default User;
