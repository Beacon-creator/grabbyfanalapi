import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

// Create BankLink Schema
const bankLinkSchema = new Schema({
    AccountOwnerName: {
        type: String,
        required: false // Optional field
    },
    AccountNumber: {
        type: String,
        required: false // Optional field
    },
    BVN: {
        type: String,
        required: false // Optional field
    }
});

// Create a model from the schema
const BankLink = model('BankLink', bankLinkSchema);

export default BankLink;
