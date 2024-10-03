import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

// Create CardLink Schema
const cardLinkSchema = new Schema({
    CardHolderName: {
        type: String,
        required: false // Optional field
    },
    CardNumber: {
        type: String,
        required: false // Optional field
    },
    CVV: {
        type: String,
        required: false // Optional field
    },
    ExpiryDate: {
        type: String, // MM/YY format
        required: false // Optional field
    }
});

// Create a model from the schema
const CardLink = model('CardLink', cardLinkSchema);

export default CardLink;
