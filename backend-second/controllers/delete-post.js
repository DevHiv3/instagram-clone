import Post from "../models/post.js"
import 'dotenv/config'

export default async function DeletePost(req,res){

    try{

        if(!req.params.id){
            return res.status(200).json({ message: "undefined" })
        }
        const result = await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }

}