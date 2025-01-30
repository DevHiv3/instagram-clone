import Post from "../models/post.js"
import User from "../models/user.js"

export default async function Feed(req,res){
    try{
        const user = await User.findById(req.params.id)
        
        if(!user){
            return res.status(404).json({ message: 'no-user-found' });
        }
    
        const posts = await Post.find({ admin:{ $in: user.followings } }).populate("comments.postedBy", "username photo _id").populate("admin", "username photo _id");
        return res.status(200).json({ message: "success", posts: posts })

    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}