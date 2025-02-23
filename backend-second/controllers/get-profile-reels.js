import Reel from "../models/reel.js"
import 'dotenv/config'


export default async function GetProfileReels(req,res){
    try{
        const result = await Reel.find({ admin: req.params.id }).populate({ path: 'admin', select: 'username _id photo',}).populate({ path: 'comments.postedBy', select: 'username _id photo',}).sort({ timestamp: -1 });
        return res.status(200).json({ message: "success", data: result })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}