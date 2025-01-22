import Story from "../models/story.js";

export default async function DeleteStory(req,res){
    try{
        const response = await Story.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "success" })

    } catch(error){
        console.log("Internal Server error: ", error)
        return resizeBy.status(500).json({ message: "Internal Server Error" })
    }
}