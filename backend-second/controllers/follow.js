import User from "../models/user.js"
import 'dotenv/config'

export default async function Follow(req,res){
    try{
        const result = await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user.id }}, { new: true })
        const response = await User.findByIdAndUpdate(req.user.id, { $push: { followings: req.params.id }}, { new: true })
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}