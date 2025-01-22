import User from "../models/user.js"
import 'dotenv/config'

export default async function EditProfile(req,res){
    try{

        if(!req.file  && !req.body){
            return res.status(404).json({ message: "body not found!"})
        }

        if(req.file){
            req.body.photo =  req.file.path;
            console.log("Updating with photo", req.file.path)
            const result = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            return res.status(200).json({ message: "success" })
        }

        console.log("upading", req.body)
        const result = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}