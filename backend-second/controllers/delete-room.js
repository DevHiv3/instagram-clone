import Room from "../models/room.js";
import Message from "../models/message.js"

export default async function DeleteRoom(req,res){
    try{
        const { sender, receiver } = req.body
        const messages = await Message.deleteMany({ $or: [ { sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }, ] })
        const response = await Room.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "success" })

    } catch(error){
        console.log("Internal Server error: ", error)
        return resizeBy.status(500).json({ message: "Internal Server Error" })
    }
}