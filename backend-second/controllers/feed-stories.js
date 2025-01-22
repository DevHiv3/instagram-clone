import Story from "../models/story.js";
import User from "../models/user.js";

export default async function FeedStories(req,res){
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).json({ message: 'no-user-found' });
        }
        
        const stories = await Story.find({ user: { $in: user.followings } }).distinct("user");
        const response = await User.find({ _id: { $in: stories } },"_id username photo")


        return res.status(200).json({ message: "success", stories: response })

    } catch(error){
        console.log("Internal Server error: ", error)
        return resizeBy.status(500).json({ message: "Internal Server Error" })
    }
}