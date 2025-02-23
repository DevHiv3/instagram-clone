import Reel from "../models/reel.js"
import 'dotenv/config'

export default async function EditReel(req,res){
    try{

        if(req.file){
            req.body.photo =  req.file.path;
            console.log("Updating with photo: ", req.params.id)
            const result = await Reel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            return res.status(200).json({ message: "success" })
        }

        const result = await Reel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}