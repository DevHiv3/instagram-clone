import Story from "../models/story.js";

export default async function FindStory(req,res){
    try{
        const response = await Story.find({ user: req.params.id })
        console.log(response)
        return res.status(200).json({ message: "success", stories: response })
        
    } catch(error){
        console.log("Internal Server error: ", error)
        return resizeBy.status(500).json({ message: "Internal Server Error" })
    }
}