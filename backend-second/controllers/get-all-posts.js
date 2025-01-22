import Post from "../models/post.js"
import 'dotenv/config'


export default async function GetAllPosts(req,res){
    try{
        const result = await Post.find().populate({ path: 'comments.postedBy', select: 'username _id photo',})
        return res.status(200).json({ message: "success", data: result })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}