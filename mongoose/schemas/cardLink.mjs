import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

// Create CardLink Schema
const cardLinkSchema = new Schema({
    cardHolderName: {
        type: String,
        required: false // Optional field
    },
    cardNumber: {
        type: String,
        required: false // Optional field
    },
    cvv: {
        type: String,
        required: false // Optional field
    },
    expiryDate: {
        type: String, // MM/YY format
        required: false // Optional field
    }
});

// Create a model from the schema
const CardLink = model('CardLink', cardLinkSchema);

export default CardLink;
