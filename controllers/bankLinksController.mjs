// controllers/bankLinkController.js

import BankLink from '../mongoose/schemas/BankLink.mjs';
import VerificationCode from '../mongoose/schemas/VerificationCode.mjs';
import { sendEmail } from '../services/emailService.mjs';

// Generate Verification Code
const generateVerificationCode = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return random.toString();
};

// Get all bank links
export async function getBankLinks(req, res) {
    try {
        const bankLinks = await find();
        res.status(200).json(bankLinks);
    } catch (error) {
        console.error('Error occurred while fetching bank links:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get a specific bank link by ID
export async function getBankLinkById(req, res) {
    try {
        const bankLink = await findById(req.params.id);
        if (!bankLink) {
            return res.status(404).json({ message: 'Bank link not found' });
        }
        res.status(200).json(bankLink);
    } catch (error) {
        console.error('Error occurred while fetching the bank link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Create a new bank link
export async function createBankLink(req, res) {
    try {
        const newBankLink = new BankLink(req.body);
        await newBankLink.save();
        res.status(201).json(newBankLink);
    } catch (error) {
        console.error('Error occurred while creating the bank link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update a bank link by ID
export async function updateBankLink(req, res) {
    try {
        const updatedBankLink = await findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBankLink) {
            return res.status(404).json({ message: 'Bank link not found' });
        }
        res.status(200).json(updatedBankLink);
    } catch (error) {
        console.error('Error occurred while updating the bank link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Delete a bank link by ID
export async function deleteBankLink(req, res) {
    try {
        const bankLink = await findByIdAndDelete(req.params.id);
        if (!bankLink) {
            return res.status(404).json({ message: 'Bank link not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error occurred while deleting the bank link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Send verification code to email
export async function sendVerificationCode(req, res) {
    try {
        const email = req.user.email;
        const code = generateVerificationCode();
        const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

        // Save the verification code to the database
        const verificationCode = new VerificationCode({ email, code, expiryDate });
        await verificationCode.save();

        // Send verification email
        await sendEmail(email, 'Your Verification Code', `Your verification code is ${code}`);

        res.status(200).json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Error occurred while sending verification code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Verify the code sent to the user
export async function verifyCode(req, res) {
    try {
        const { code } = req.body;
        const email = req.user.email;

        const verificationCode = await findOne({ email, code });
        if (!verificationCode || verificationCode.expiryDate < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        console.error('Error occurred while verifying code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
