import { Router } from 'express';
import { genSalt, hash } from 'bcryptjs';
import { createTransport } from 'nodemailer';
import User, { findById, findOne } from '../models/User'; // Mongoose User model
import EmailVerification, { findOne as _findOne, deleteOne } from '../models/EmailVerification'; // Email verification model
require('dotenv').config();

const router = Router();

// GET: api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const user = await findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST: api/signup
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const existingUser = await findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const salt = await genSalt(10);
        const passwordHash = await hash(password, salt);

        const newUser = new User({
            email: email.toLowerCase(),
            passwordHash,
            isEmailVerified: false,
        });

        await newUser.save();

        // Generate verification code
        const verificationCode = generateVerificationCode();
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

        const emailVerification = new EmailVerification({
            email: newUser.email,
            verificationCode,
            expiryDate,
        });

        await emailVerification.save();

        console.log(`Verification code ${verificationCode} sent to ${email} with expiry ${expiryDate}.`);

        // Send verification email
        const subject = 'Email Verification Code';
        const message = `Your email verification code is ${verificationCode}.`;

        await sendEmail(email, subject, message);

        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST: api/signup/verify-email
router.post('/verify-email', async (req, res) => {
    const { email, code } = req.body;

    try {
        const emailVerification = await _findOne({
            email: email.toLowerCase(),
            verificationCode: code,
            expiryDate: { $gt: new Date() }, // Check if the code is not expired
        });

        if (!emailVerification) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        const user = await findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isEmailVerified = true;
        await user.save();

        // Remove used verification code
        await deleteOne({ email: email.toLowerCase() });

        console.log(`Email verified successfully for ${email}`);
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Helper function to generate verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to send email using Nodemailer
const sendEmail = async (to, subject, text) => {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

export default router;
