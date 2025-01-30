import Room from "../models/room.js"
import Message from "../models/message.js"

export default async function SendMessage(socket, msg, room, sender, receiver){
    try{
        if(room == ""){
            console.log("room required!")
        } else {
            const message = new Message({
                message: msg,
                timestamp: new Date().toISOString(),
                type: "text",
                seen: false,
                sender: sender,
                receiver: receiver,
                room: room
            })

            await message.save()

            const result = await Room.findByIdAndUpdate(room, { $set: { message: msg, messageTimestamp: new Date().toISOString(), latestMessageTimestamp: new Date().toISOString() } }, { new: true })
            const newMessages = await Message.find({ $or: [ { sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }, ] }).populate("sender", "username _id photo").populate("receiver", "username _id photo")
            
            socket.to(room).emit("receive-messages", newMessages)
        }

    } catch(error){
        console.log("Internal Server Error: ", error)

    }
}