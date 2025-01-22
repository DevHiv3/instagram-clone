import user from "../models/user.js";
import User from "../models/user.js";

export default async function VerifyOTP(req,res){
    try{

        const { otp, email } = req.body
        const user = await User.findOne({ email: email })

        if(!user){
            console.log(user)
            return res.status(404).json({ message: "user not found" })
        }

        const code = user.otp

        console.log(code, otp)

        if(Number(otp) === code){
            console.log(code === otp)
            return res.status(200).json({ message: "success" })
        } else {
            return res.status(200).json({ message: "Invalid Credentials" })
        }

    } catch(error){
        console.log("Internal Server Error: ", error)
        return res.status(500).json({ message: "INternal Server Error"})
    }
}