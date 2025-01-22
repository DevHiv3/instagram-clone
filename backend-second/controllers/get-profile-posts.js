import Post from "../models/post.js"
import 'dotenv/config'


export default async function GetProfilePosts(req,res){
    try{
        const result = await Post.find({ admin: req.params.id }).sort({ timestamp: -1 }); 
        console.log(result)
        return res.status(200).json({ message: "success", data: result })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}