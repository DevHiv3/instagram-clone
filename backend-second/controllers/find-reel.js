import Reel from "../models/reel.js"
import 'dotenv/config'

export default async function FindReel(req,res){
    try{
        const reel = await Reel.findById(req.params.id).populate('comments.postedBy admin')
        return res.status(200).json({ message: "success", data: reel })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}