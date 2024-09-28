import { Router } from 'express';
import { genSalt, hash } from 'bcryptjs';
import { createTransport } from 'nodemailer';
import { randomBytes } from 'crypto';
import { findOne } from '../models/User';
import PasswordReset, { findOne as _findOne } from '../models/PasswordReset'; // Model for storing reset codes
import PasswordResetToken, { findOne as __findOne, deleteOne } from '../models/PasswordResetToken'; // Model for temporary tokens
require('dotenv').config();

const router = Router();

// POST: api/password-reset/send-code
router.post('/send-code', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist.' });
        }

        const verificationCode = generateVerificationCode();
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiry

        const passwordReset = new PasswordReset({
            email: user.email,
            verificationCode,
            expiryDate,
        });

        await passwordReset.save();

        console.log(`Verification code ${verificationCode} sent to ${email} with expiry ${expiryDate}.`);

        const subject = 'Password Reset Verification Code';
        const message = `Your verification code is ${verificationCode}`;
        await sendEmail(email, subject, message);

        return res.status(200).json({ message: 'Verification code sent successfully.' });
    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST: api/password-reset/verify-code
router.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const passwordReset = await _findOne({
            email: email.toLowerCase(),
            verificationCode: code,
            expiryDate: { $gt: new Date() }, // Check if the code is valid and not expired
        });

        if (!passwordReset) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

        // Generate a temporary token valid for 15 minutes
        const tempToken = generateTemporaryToken();
        const tokenExpiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

        const resetToken = new PasswordResetToken({
            email: email.toLowerCase(),
            token: tempToken,
            expiryDate: tokenExpiryDate,
        });

        await resetToken.save();

        console.log(`Temporary token generated for ${email}`);

        return res.status(200).json({ token: tempToken });
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST: api/password-reset/reset-password
router.post('/reset-password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const resetToken = await __findOne({
            email: email.toLowerCase(),
            token: token,
            expiryDate: { $gt: new Date() }, // Check if the token is valid and not expired
        });

        if (!resetToken) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const user = await findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist.' });
        }

        const salt = await genSalt(10);
        const passwordHash = await hash(password, salt);

        user.passwordHash = passwordHash;
        await user.save();

        // Remove the used token after resetting the password
        await deleteOne({ email: email.toLowerCase(), token: token });

        console.log(`Password has been reset successfully for ${email}`);
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Helper function to generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to generate a temporary token using crypto
const generateTemporaryToken = () => {
    return randomBytes(32).toString('hex');
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
