import Notification from "../models/notification.js";

export default async function ReceiveNotification(req,res){
    try{

        const notifications = await Notification.find({ receiver: req.user.id }).sort({ timestamp: -1 })

        return res.status(200).json({ message: "success", notifications: notifications })
        
    } catch(error){
        console.log("Internal Server error: ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}