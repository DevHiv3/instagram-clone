import BookMark from "../models/bookmark.js"
import 'dotenv/config'

export default async function GetBookMarks(req,res){
    try{
        const result = await BookMark.find({ markedBy: req.user.id }).populate({ path: 'markedBy', select: 'username _id photo',}).sort({ timestamp: -1 }); 
        return res.status(200).json({ message: "success", bookmarks: result })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}