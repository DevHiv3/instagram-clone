import Post from "../models/post.js"
import 'dotenv/config'

export default async function LikePost(req,res){
    try{
        const result = await Post.findByIdAndUpdate(req.params.id, { $push: { likes: req.user.id }}, { new: true })
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}