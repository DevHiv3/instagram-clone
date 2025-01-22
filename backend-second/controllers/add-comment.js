import Post from "../models/post.js"
import mongoose from "mongoose"
import 'dotenv/config'

export default async function AddComment(req,res){
    try{
        const comment = {
            _id: new mongoose.Types.ObjectId(),
            text: req.body.comment,
            timestamp: new Date().toISOString(),
            postedBy: req.user.id
        }
        const result = await Post.findByIdAndUpdate(req.params.id, { $push: { comments: comment } }, { new: true })
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}