import User from "../models/user.js"

export default async function AddPushToken(req,res){
    try{

        const { pushToken } = req.body

        const user = await User.findById(req.user.id)
        const result = await User.findByIdAndUpdate(req.user.id, { $set: { deviceToken: pushToken } }, { new: true })
        
        return res.status(200).json({ message: "success", pushToken: pushToken })
        
    } catch(error){
        console.log("Internal Server error: ", error)
        return resizeBy.status(500).json({ message: "Internal Server Error" })
    }
}