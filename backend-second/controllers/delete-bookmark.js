import BookMark from "../models/bookmark.js";

export default async function DeleteBookMark(req,res){
    try{
        const response = await BookMark.deleteMany({ markedBy: req.user.id, post: req.params.id })
        const bookmarks = await BookMark.find({ markedBy: req.user.id }).populate({ path: 'markedBy', select: 'username _id photo',}).sort({ timestamp: -1 }); 
        return res.status(200).json({ message: "success", bookmarks: bookmarks.map((b)=> b.post) })

    } catch(error){
        console.log("Internal Server error: ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}