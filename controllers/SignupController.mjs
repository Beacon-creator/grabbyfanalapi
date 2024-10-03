// controllers/userController.mjs
import bcrypt from 'bcryptjs';
import pkg from 'bcryptjs'; // Import the entire bcryptjs module
import { sendEmail } from '../services/emailService.mjs';
import User from '../mongoose/schemas/users.mjs'; // Mongoose User model
import EmailVerification from '../mongoose/schemas/emailVerification.mjs'; // Email verification model


//const { genSalt, hash } = pkg; // Destructure what you need from the bcryptjs package

// Fetch user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// User signup with email verification
export const signupUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const salt = 10;
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email: email.toLowerCase(),
            passwordHash: passwordHash,
            isEmailVerified: false,
        });

        await newUser.save();

        const verificationCode = generateVerificationCode();
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

        const emailVerification = new EmailVerification({
            email: newUser.email,
            verificationCode,
            expiryDate,
        });

        await emailVerification.save();

        console.log(`Verification code ${verificationCode} sent to ${email} with expiry ${expiryDate}.`);

        const subject = 'Email Verification Code';
        const message = `Your email verification code is ${verificationCode}.`;

        await sendEmail(email, subject, message); // Use Mailgun for sending email

        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify email with verification code
export const verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        const emailVerification = await EmailVerification.findOne({
            email: email.toLowerCase(),
            verificationCode: code,
            expiryDate: { $gt: new Date() }, // Check if the code is not expired
        });

        if (!emailVerification) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isEmailVerified = true;
        await user.save();

        // Remove the used verification code
        await EmailVerification.deleteOne({ email: email.toLowerCase() });

        console.log(`Email verified successfully for ${email}`);
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Helper function to generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};