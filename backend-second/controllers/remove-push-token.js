import User from "../models/user.js"

export default async function RemovePushToken(req,res){
    try{

        const user = await User.findById(req.user.id)
        const result = await User.findByIdAndUpdate(req.user.id, { $set: { deviceToken: "" } }, { new: true })
        
        return res.status(200).json({ message: "success" })
        
    } catch(error){
        console.log("Internal Server error: ", error)
        return resizeBy.status(500).json({ message: "Internal Server Error" })
    }
}