import Room from "../models/room.js"
import Message from "../models/message.js"

export default async function DeleteMessage(socket, room, messageId, sender, receiver){
    try{
        if(room == ""){
            console.log("room required!")
        } else {
            const result = await Message.findByIdAndDelete(messageId)
            const newMessages = await Message.find({ $or: [ { sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }, ] }).populate("sender", "username _id photo").populate("receiver", "username _id photo")
            socket.to(room).emit("receive-messages", newMessages)
        }

    } catch(error){
        console.log("Internal Server Error: ", error)
    }
}