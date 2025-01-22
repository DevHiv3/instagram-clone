import Room from "../models/room.js"
import Message from "../models/message.js"

export default async function UserConnection(socket, username, id, users){
    users[socket.id] = username
    socket.broadcast.emit('user-joined', { message: socket.id })
}