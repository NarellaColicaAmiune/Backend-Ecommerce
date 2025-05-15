import { createTransport } from "nodemailer";
import 'dotenv/config';

export const transporter = createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});

export const sendMail = async (email, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject,
            text,
        });
    } catch (error) {
        console.log(error);
    }
}