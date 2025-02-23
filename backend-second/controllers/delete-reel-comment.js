import Reel from "../models/reel.js"
import 'dotenv/config'

export default async function DeleteReelComment(req,res){
    try{
        const result = await Reel.findByIdAndUpdate(req.params.id, { $pull:{ comments:{ _id: req.query.comment }}}, { new: true })
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}