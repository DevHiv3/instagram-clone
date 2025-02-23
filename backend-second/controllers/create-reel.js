import 'dotenv/config'
import Reel from "../models/reel.js"

export default async function CreateReel(req,res){
    try{
        if(!req.file){
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { caption, admin } = req.body

        const fileUrl = req.file.path

        const reel = new Reel({
            admin: admin,
            caption: caption,
            url: fileUrl,
            timestamp: new Date().toISOString(),
        })

        await reel.save()
        
        return res.status(200).json({ message: "success" })

    } catch (error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
    }
}