import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

// Create BankLink Schema
const bankLinkSchema = new Schema({
    accountOwnerName: {
        type: String,
        required: false // Optional field
    },
    accountNumber: {
        type: String,
        required: false // Optional field
    },
    bvn: {
        type: String,
        required: false // Optional field
    }
});

// Create a model from the schema
const BankLink = model('BankLink', bankLinkSchema);

export default BankLink;
