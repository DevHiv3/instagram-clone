import Room from "../models/room.js"
import Message from "../models/message.js"

export default async function JoinRoom(socket, roomId, sender, receiver){
    socket.join(roomId);
    console.log(`User joined room: ${roomId}, sender: ${sender} and receiver: ${receiver}`);
    const newMessages = await Message.find({ $or: [ { sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }, ] })
    socket.to(roomId).emit("receive-messages", newMessages)
}