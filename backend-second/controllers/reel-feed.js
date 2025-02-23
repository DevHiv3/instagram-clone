import Reel from "../models/reel.js"
import User from "../models/user.js"

export default async function ReelFeed(req,res){
    try{
        const user = await User.findById(req.user.id)
        
        if(!user){
            return res.status(404).json({ message: 'no-user-found' });
        }
    
        const reels = await Reel.find({ admin:{ $in: user.followings } }).populate("comments.postedBy", "username photo _id").populate("admin", "username photo _id").sort({ timestamp: -1 });
        return res.status(200).json({ message: "success", data: reels })

    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}