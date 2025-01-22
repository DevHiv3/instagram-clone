import User from "../models/user.js"
import nodemailer from 'nodemailer';
import "dotenv/config"
import { Verification_Email_Template } from '../middlewares/email-template.js';
import crypto from 'crypto';

export default async function Verification(req,res){
    try{

        const { email } = req.body;

        const user = await User.findOne({ email: email })

        if(!user){
            console.log(user)
            return res.status(404).json({ message: "user not found!" })
        }

        const generateOtp = () => {
            return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
        };

        const otp = generateOtp();
  
        const result = await User.findByIdAndUpdate(user._id, { $set: { otp: otp }}, { new: true })
        console.log(user, result)

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
             user: 'arnabgogoi83@gmail.com',
             pass: 'erzs cmdi xlkv opkf'
            }
          });

        const msg = {
          to: user.email,
          from: process.env.EMAIL_USER,
          subject: "USER VERIFICATION",
          text: 'This is a test email sent using SendGrid.',
          html: Verification_Email_Template.replace("{verificationCode}", otp)
        };

        const response = await transporter.sendMail(msg)

        return res.status(200).json({ message: "success", otp: otp })

    } catch(error){
        console.log("Internal Server Error: ", error.response.body.errors)
        return res.status(500).json({ message: "Internal Server Error"})
    }
}