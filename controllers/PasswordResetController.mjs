import pkg from 'bcryptjs'; // Import the entire bcryptjs module
import { randomBytes } from 'crypto';
import User from '../mongoose/schemas/users.mjs'; // Mongoose User model
import PasswordReset from '../mongoose/schemas/passwordReset.mjs'; // Model for storing reset codes
import PasswordResetToken from '../mongoose/schemas/passwordresetToken.mjs'; // Model for temporary tokens
import { sendEmail } from '../services/emailService.mjs'; // Import the sendEmail function from emailService.mjs

const { genSalt, hash } = pkg; // Destructure what you need from the bcryptjs package

// Send password reset verification code
export const sendPasswordResetCode = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
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

        // Send the email using the imported sendEmail function
        await sendEmail(email, subject, message);

        return res.status(200).json({ message: 'Verification code sent successfully.' });
    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify the password reset code
export const verifyPasswordResetCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        const passwordReset = await PasswordReset.findOne({
            email: email.toLowerCase(),
            verificationCode: code,
            expiryDate: { $gt: new Date() }, // Check if the code is valid and not expired
        });

        if (!passwordReset) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

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
};

// Reset the password
export const resetPassword = async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const resetToken = await PasswordResetToken.findOne({
            email: email.toLowerCase(),
            token: token,
            expiryDate: { $gt: new Date() }, // Check if the token is valid and not expired
        });

        if (!resetToken) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist.' });
        }

        const salt = await genSalt(10);
        const passwordHash = await hash(password, salt);

        user.passwordHash = passwordHash;
        await user.save();

        await PasswordResetToken.deleteOne({ email: email.toLowerCase(), token: token });

        console.log(`Password has been reset successfully for ${email}`);
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Helper function to generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to generate a temporary token using crypto
const generateTemporaryToken = () => {
    return randomBytes(32).toString('hex');
};
