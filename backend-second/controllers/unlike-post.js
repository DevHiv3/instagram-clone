import Post from "../models/post.js"
import 'dotenv/config'

export default async function UnlikePost(req,res){
    try{
        const result = await Post.findByIdAndUpdate(req.params.id,  { $pull: { likes: req.user._id }}, { new: true })
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}