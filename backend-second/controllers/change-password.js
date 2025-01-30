import User from "../models/user.js"
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'
import "dotenv/config"
import { Verification_Email_Template } from '../middlewares/email-template.js';

export default async function ChangePassword(req,res){
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email })

        if(!user){
            console.log(user)
            return res.status(404).json({ message: "user not found!" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const ChangePass = await User.findByIdAndUpdate(user._id, { $set: { password: hashedPassword }}, { new: true })

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASSKEY
              }
        });

        const msg = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "USER VERIFICATION",
            text: 'This is a test email sent using SendGrid.',
            html: `<h1>hi</h1>`
        };
        
        const response = await transporter.sendMail(msg)
        return res.status(200).json({ message: "success" })
        
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
        
    }
}