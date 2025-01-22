import User from "../models/user.js"
import Post from "../models/post.js"

export default async function DeleteUser(req,res){
    try {
        const userId = req.user.id

        const existingUser = await User.findById(userId);
          if (!existingUser) {
              console.log("user don't exists!")
            
              return res.status(400).json({ message: "user don't exists!" });
          }

        const response = await Post.deleteMany({ admin: userId })
        const result = await User.findByIdAndDelete(userId)
        return res.status(200).json({ message: "success" })

    } catch(error){
        console.log(error)
        res.status(500).json({ message: 'error', error });
        
    }
}