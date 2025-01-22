import 'dotenv/config'
import Post from "../models/post.js"

export default async function CreatePost(req,res){
    try{
        if(!req.file){
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { caption, type, admin } = req.body

        const fileUrl = req.file.path

        const post = new Post({
            admin: admin,
            caption: caption,
            photo: fileUrl,
            type: type,
            timestamp: new Date().toISOString(),
        })

        await post.save()
        
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}