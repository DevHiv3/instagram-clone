import User from "../models/user.js"
import 'dotenv/config'

export default async function Unfollow(req,res){
    try{
        const result = await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id }}, { new: true })
        const response = await User.findByIdAndUpdate(req.user.id, { $pull: { followings: req.params.id }}, { new: true })
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}