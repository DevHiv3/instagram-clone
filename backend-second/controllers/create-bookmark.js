import BookMark from "../models/bookmark.js"
import User from "../models/user.js"
import "dotenv/config"

export default async function CreateBookMark(req,res){
    try{

        const { postId, photo } = req.body
        const user = await User.findById(req.user.id)
 
        if(!user){
         // console.log(user)
          return res.status(404).json({ message: "No user found" })
        }

        const bookmark = new BookMark({
            post: postId,
            markedBy: req.user.id,
            photo: photo,
            timestamp: new Date().toISOString(),
        })
        await bookmark.save();

        const bookmarks = await BookMark.find({ markedBy: req.user.id }).populate({ path: 'markedBy', select: 'username _id photo',}).sort({ timestamp: -1 }); 
        return res.status(200).json({ message: "success", bookmarks: bookmarks.map((b)=> b.post) })
        
    } catch(error){
        console.log("Internal Server error: ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}