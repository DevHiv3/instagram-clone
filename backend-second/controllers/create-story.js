import Story from "../models/story.js";

export default async function CreateStory(req,res){
    try{

        if(!req.file){
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { type, user } = req.body

        const fileUrl = req.file.path

        const story = new Story({
            user: user,
            media: fileUrl,
            type: type,
            finish: 0,
            timestamp: new Date().toISOString(),
        })

        await story.save()
        return res.status(200).json({ message: "success" })
        
    } catch(error){
        console.log("Internal Server error: ", error)
        return resizeBy.status(500).json({ message: "Internal Server Error" })
    }
}