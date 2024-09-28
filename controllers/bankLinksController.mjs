const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');
const BankLink = require('../models/BankLink');
const VerificationCode = require('../models/VerificationCode');
const { sendEmail } = require('../services/emailService');
require('dotenv').config();

const router = express.Router();

// Generate Verification Code
const generateVerificationCode = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return random.toString();
};

// GET: api/bank-links
router.get('/', verifyToken, async (req, res) => {
    try {
        const bankLinks = await BankLink.find();
        res.status(200).json(bankLinks);
    } catch (error) {
        console.error('Error occurred while fetching bank links:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET: api/bank-links/:id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const bankLink = await BankLink.findById(req.params.id);
        if (!bankLink) {
            return res.status(404).json({ message: 'Bank link not found' });
        }
        res.status(200).json(bankLink);
    } catch (error) {
        console.error('Error occurred while fetching the bank link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST: api/bank-links
router.post('/', verifyToken, async (req, res) => {
    try {
        const newBankLink = new BankLink(req.body);
        await newBankLink.save();
        res.status(201).json(newBankLink);
    } catch (error) {
        console.error('Error occurred while creating the bank link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT: api/bank-links/:id
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedBankLink = await BankLink.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBankLink) {
            return res.status(404).json({ message: 'Bank link not found' });
        }
        res.status(200).json(updatedBankLink);
    } catch (error) {
        console.error('Error occurred while updating the bank link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE: api/bank-links/:id
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const bankLink = await BankLink.findByIdAndDelete(req.params.id);
        if (!bankLink) {
            return res.status(404).json({ message: 'Bank link not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error occurred while deleting the bank link:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST: api/bank-links/send-verification-code
router.post('/send-verification-code', verifyToken, async (req, res) => {
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
});

// POST: api/bank-links/verify-code
router.post('/verify-code', verifyToken, async (req, res) => {
    try {
        const { code } = req.body;
        const email = req.user.email;

        const verificationCode = await VerificationCode.findOne({ email, code });
        if (!verificationCode || verificationCode.expiryDate < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        res.status(200).json({ message: 'Verification successful' });
    } catch (error) {
        console.error('Error occurred while verifying code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
