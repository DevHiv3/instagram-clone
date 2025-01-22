import Message from "../models/message.js"

export default async function GetAllMessages(req,res){

    try{
        const { sender, receiver } = req.body
        const messages = await Message.find({ $or: [ { sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }, ] }).populate("sender", "username _id photo").populate("receiver", "username _id photo")
   
   
        return res.status(200).json({ message: "success", messages: messages })

    } catch (error){
        console.log(error)
        return res.status(500).json({ message: 'error', error });
    }

}