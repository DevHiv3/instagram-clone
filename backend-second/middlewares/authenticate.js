import jwt from 'jsonwebtoken'
import User from "../models/user.js"
import 'dotenv/config'

async function authenticate(req, res, next){
  const token = req.headers['authorization'].split(' ')[1];
  
  if (!token) {
    console.log(token)
    return res.status(401).json({ message:'Access Denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async(err, data)=> {
    if (err) {
      console.log(token)
      return res.status(403).json({ message: 'Invalid Token'});
    }

    const user = await User.findOne({ email: data.email })
    if(!user){
      console.log(user)
      return res.status(404).json({ message: "User not found" })
    }

    req.user = user;
    next();
  });
}

export default authenticate