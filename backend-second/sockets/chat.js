import UserConnection from "../controllers/user-connection.js";
import JoinRoom from "../controllers/join-room.js";
import SendMessage from "../controllers/send-message.js";
import Disconnect from "../controllers/disconnect-chat.js";
import SendMessageMedia from "../controllers/send-message-media.js"
import DeleteMessage from "../controllers/delete-message.js";
const users = {}

export default function ChatSocket(socket,io){

    socket.on('user-connected', (username, id)=> UserConnection(socket, username, id, users))

    socket.on('join-room', (roomId, sender, receiver) => JoinRoom(socket, roomId, sender, receiver))
    
    socket.on("disconnect",()=> Disconnect(socket))

    socket.on("send-message", (msg, room, sender, receiver) => SendMessage(socket, msg, room, sender, receiver));

    socket.on("send-message-media", (img, fileType, base64, room, sender, receiver) => SendMessageMedia(socket, img, fileType, base64, room, sender, receiver));

    socket.on("delete-message", (room, messageId, sender, receiver)=> DeleteMessage(socket, room, messageId, sender, receiver))

}
