import Room from "../models/room.js"
import Message from "../models/message.js"
import { uploadToCloudinary } from "../middlewares/cloudinary.js";

export default async function SendMessageMedia(socket, img, fileType, base64, room, sender, receiver){
    try{
        if(room == ""){
            console.log("room required!")
        } else {

            const image = await uploadToCloudinary(base64, img, "profile-pics", fileType);
            
            if (!image?.secure_url) {
                console.log("File buffer size:", base64?.length || "Invalid buffer");
                console.log("File name:", img || "Invalid file name");
                console.error("Image upload failed!", image);
                return;
            }

            const message = new Message({
                message: image.secure_url,
                timestamp: new Date().toISOString(),
                type: "image",
                seen: false,
                sender: sender,
                receiver: receiver,
                room: room
            })

            await message.save()

            const result = await Room.findByIdAndUpdate(room, { $set: { message: "image" } }, { new: true })
            const newMessages = await Message.find({ $or: [ { sender: sender, receiver: receiver }, { sender: receiver, receiver: sender }, ] }).populate("sender", "username _id photo").populate("receiver", "username _id photo")
            
            socket.to(room).emit("receive-messages", newMessages)
        }

    } catch(error){
        console.log("Internal Server Error: ", error)

    }
}