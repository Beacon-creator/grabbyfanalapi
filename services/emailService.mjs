// emailService.mjs
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const mailgunApiKey = process.env.MAILGUN_APIKEY;
const mailgunDomain = process.env.MAILGUN_DOMAIN;

const client = axios.create({
    baseURL: `https://api.mailgun.net/v3/${mailgunDomain}`,
    auth: {
        username: 'api',
        password: mailgunApiKey
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

export async function sendEmail(toEmail, subject, message) {
    try {
        const params = new URLSearchParams();
        params.append('from', `Excited User <mailgun@${mailgunDomain}>`);
        params.append('to', toEmail);
        params.append('subject', subject);
        params.append('text', message);

        const response = await client.post(`/messages`, params);
        console.log(`Email sent successfully: ${response.data}`);
    } catch (error) {
       // console.error(`Error sending email: ${error.response?.data || error.message}`);
    }
}
