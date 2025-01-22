import User from "../models/user.js"
import 'dotenv/config'

export default async function SearchUser(req,res){
    try{
        console.log(req.query.username)
        const users = await User.find({ username: { $regex: req.query.username, $options: 'i' } })
        console.log(users)
        res.status(200).json({ message: "message", data: users })
    } catch(error){
        console.error("Internal Server Error: ", error)
        res.status(500).json({ message: "Internal Server Error"})
    }
}