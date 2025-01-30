import User from "../models/user.js"
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'
import createToken from '../middlewares/create-token.js';
import "dotenv/config"
import { PASS_CHANGE_EMAIL_TEMPLATE } from "../middlewares/pass-changed-template.js"
export default async function ForgotPassword(req,res){
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
            subject: "Change Password Request",
            text: 'Your password has been changed',
            html: PASS_CHANGE_EMAIL_TEMPLATE.replace("{pass}", password)
        };
        
        const response = await transporter.sendMail(msg)
        const token = createToken(user);

        return res.status(200).json({ message: "success", token, id: user._id })
        
    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
        
    }
}