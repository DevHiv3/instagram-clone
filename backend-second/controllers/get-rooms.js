import Room from "../models/room.js"

export default async function GetRooms(req,res){
    try{
        
        const rooms = await Room.find({ users: req.user.id }).sort({ latestMessageTimestamp: -1 }).populate({
            path: "users", 
            select: "username photo _id", 
            match: { _id: { $ne: req.user.id } }  // Filter users by user ID
        });

        if(!rooms){
            return res.status(403).json({ message: "No rooms found for this user ID!" })
        }

        return res.status(200).json({ message: "success", rooms: rooms, userId: req.user.id })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }

}