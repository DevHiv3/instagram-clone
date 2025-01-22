import Post from "../models/post.js"
import 'dotenv/config'

export default async function FindPost(req,res){
    try{
        const post = await Post.findById(req.params.id).populate('comments.postedBy admin')
        return res.status(200).json({ message: "success", data: post })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}