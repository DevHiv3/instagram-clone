import Room from "../models/room.js"

export default async function CreateRoom(req,res){

    try{
        const { userId } = req.body
        const existingRoom = await Room.findOne({ users: { $all: [userId, req.user.id] }, });

        if(existingRoom){
            return res.status(403).json({ message: "room already exist!", id: existingRoom._id })
        }

        const room = new Room({
            users: [userId, req.user.id],
            message: "start a conversation",
            messageTimestamp: new Date().toISOString(),
            timestamp: new Date().toISOString(),
        })

        await room.save()
   
        return res.status(200).json({ message: "success", id: room._id })

    } catch (error){
        console.log(error)
        return res.status(500).json({ message: 'error', error });
    }

}