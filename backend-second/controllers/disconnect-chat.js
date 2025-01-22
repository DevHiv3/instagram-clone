import Room from "../models/room.js"
import Message from "../models/message.js"

export default async function Disconnect(socket){
    console.log(`User disconnected: ${socket.id}`)
}