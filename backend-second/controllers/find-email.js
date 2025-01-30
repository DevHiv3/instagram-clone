import User from "../models/user.js"
import 'dotenv/config'

export default async function FindEmail(req,res){
    try{
        console.log(req.query.username)
        const users = await User.find({ email: req.query.email })
        if(users.length == 0){
            return res.status(200).json({ message: "success" })
        }
        res.status(200).json({ message: "success", data: users })
    } catch(error){
        console.error("Internal Server Error: ", error)
        res.status(500).json({ message: "Internal Server Error"})
    }
}