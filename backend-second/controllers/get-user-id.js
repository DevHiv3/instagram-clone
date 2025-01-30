import User from "../models/user.js"

export default async function getUserID(req,res){
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        
        const response = {
            username: user.username,
            photo: user.photo,
            email: user.email,
            id: user._id,
            status: user.status,
            timestamp: user.timestamp,
            followings: user.followings,
            followers: user.followers,
            message: "success"
        }

        res.status(200).json(response);
    } catch(error){
        console.error(req.params.id)
        res.status(500).json({ message: 'Internal server error', error });
    }  
}