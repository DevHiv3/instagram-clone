import User from "../models/user.js"
import 'dotenv/config'

export default async function RemoveFollower(req,res){
    try{
        const response = await User.findByIdAndUpdate(req.user.id, { $pull: { followers: req.params.id }}, { new: true })
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}